import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Bell, Building2, CalendarDays, FileText, Flame, Home, MapPin, Plus, Search, Settings, ShieldAlert, Wrench, Download, Upload, Save, Trash2, AlertTriangle, ClipboardList, BookOpen } from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'firevault2_data_v2';

const emptyData = {
  sites: [
    {
      id: crypto.randomUUID(),
      name: 'Demo Site - Lincoln School',
      address: '123 Main St, Casper, WY',
      customer: 'Lincoln School District',
      contact: 'Facilities Office',
      phone: '',
      panelManufacturer: 'Fire-Lite',
      panelModel: 'MS-9200UDLS',
      communicator: 'Cell dialer',
      monitoringAccount: '',
      accessNotes: 'Main FACP is in the electrical room near the office. Ask front desk for access.',
      knownIssues: 'NAC 2 has had intermittent ground fault during heavy rain. Check exterior horn/strobes first.',
      generalNotes: 'Annual inspection photos should be added next visit.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visits: [
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString().slice(0, 10),
          title: 'Demo previous service visit',
          notes: 'Checked intermittent NAC trouble. Panel normal on arrival. Recommend inspecting exterior devices if trouble returns.',
          createdAt: new Date().toISOString()
        }
      ]
    }
  ],
  resources: [
    { id: crypto.randomUUID(), maker: 'Fire-Lite', title: 'Panel manuals and programming notes', note: 'Add links and your own quick notes here.' },
    { id: crypto.randomUUID(), maker: 'Silent Knight', title: 'Common trouble references', note: 'Add walk-test and reset procedures.' },
    { id: crypto.randomUUID(), maker: 'Notifier', title: 'Field notes', note: 'Add customer-specific observations or public manual links.' }
  ]
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw);
    return { sites: parsed.sites || [], resources: parsed.resources || [] };
  } catch {
    return emptyData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [editingSite, setEditingSite] = useState(null);

  useEffect(() => saveData(data), [data]);

  const selectedSite = useMemo(() => data.sites.find(s => s.id === selectedSiteId) || null, [data.sites, selectedSiteId]);
  const filteredSites = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return data.sites;
    return data.sites.filter(site => [site.name, site.address, site.customer, site.panelManufacturer, site.panelModel, site.knownIssues, site.generalNotes].join(' ').toLowerCase().includes(q));
  }, [data.sites, query]);

  function upsertSite(site) {
    const now = new Date().toISOString();
    setData(prev => {
      const exists = prev.sites.some(s => s.id === site.id);
      const nextSite = { ...site, updatedAt: now, createdAt: site.createdAt || now, visits: site.visits || [] };
      return {
        ...prev,
        sites: exists ? prev.sites.map(s => s.id === site.id ? nextSite : s) : [nextSite, ...prev.sites]
      };
    });
    setSelectedSiteId(site.id);
    setEditingSite(null);
    setTab('siteDetail');
  }

  function deleteSite(id) {
    if (!confirm('Delete this site and all visit history?')) return;
    setData(prev => ({ ...prev, sites: prev.sites.filter(s => s.id !== id) }));
    setSelectedSiteId(null);
    setTab('sites');
  }

  function addVisit(siteId, visit) {
    setData(prev => ({
      ...prev,
      sites: prev.sites.map(site => site.id === siteId ? { ...site, visits: [{ ...visit, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...(site.visits || [])], updatedAt: new Date().toISOString() } : site)
    }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firevault-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!Array.isArray(imported.sites)) throw new Error('Invalid backup');
        setData({ sites: imported.sites, resources: imported.resources || [] });
        alert('Backup imported.');
      } catch {
        alert('Could not import this file.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="app">
      <Header />
      <main className="main">
        {tab === 'dashboard' && <Dashboard data={data} onAddSite={() => { setEditingSite(newSite()); setTab('editSite'); }} onOpenSites={() => setTab('sites')} onOpenSite={(id) => { setSelectedSiteId(id); setTab('siteDetail'); }} />}
        {tab === 'sites' && <Sites sites={filteredSites} query={query} setQuery={setQuery} onAdd={() => { setEditingSite(newSite()); setTab('editSite'); }} onOpen={(id) => { setSelectedSiteId(id); setTab('siteDetail'); }} />}
        {tab === 'siteDetail' && selectedSite && <SiteDetail site={selectedSite} onEdit={() => { setEditingSite(selectedSite); setTab('editSite'); }} onDelete={() => deleteSite(selectedSite.id)} onAddVisit={(visit) => addVisit(selectedSite.id, visit)} />}
        {tab === 'siteDetail' && !selectedSite && <EmptyState title="No site selected" text="Open the Sites tab and choose a customer site." />}
        {tab === 'editSite' && editingSite && <EditSite site={editingSite} onCancel={() => { setEditingSite(null); setTab(selectedSite ? 'siteDetail' : 'sites'); }} onSave={upsertSite} />}
        {tab === 'resources' && <Resources resources={data.resources} />}
        {tab === 'settings' && <SettingsPage onExport={exportData} onImport={importData} siteCount={data.sites.length} />}
      </main>
      <nav className="bottomNav">
        <NavButton icon={<Home />} label="Today" active={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
        <NavButton icon={<Building2 />} label="Sites" active={tab === 'sites' || tab === 'siteDetail' || tab === 'editSite'} onClick={() => setTab('sites')} />
        <NavButton icon={<BookOpen />} label="Library" active={tab === 'resources'} onClick={() => setTab('resources')} />
        <NavButton icon={<Settings />} label="Settings" active={tab === 'settings'} onClick={() => setTab('settings')} />
      </nav>
    </div>
  );
}

function Header() {
  return <header className="header"><div className="brandMark"><Flame size={22} /></div><div><h1>FireVault</h1><p>Field knowledge system</p></div></header>;
}

function NavButton({ icon, label, active, onClick }) {
  return <button className={`navButton ${active ? 'active' : ''}`} onClick={onClick}>{React.cloneElement(icon, { size: 20 })}<span>{label}</span></button>;
}

function Dashboard({ data, onAddSite, onOpenSites, onOpenSite }) {
  const recent = data.sites.slice(0, 3);
  const visitCount = data.sites.reduce((n, s) => n + (s.visits?.length || 0), 0);
  return <section className="page">
    <div className="heroCard">
      <p className="eyebrow">Good day, David</p>
      <h2>What do we know about this site?</h2>
      <p>Build a permanent memory for every customer location, panel, issue, and service visit.</p>
      <div className="heroActions"><button className="primary" onClick={onAddSite}><Plus size={18}/> Add Site</button><button className="secondary" onClick={onOpenSites}><Search size={18}/> Search Sites</button></div>
    </div>
    <div className="statsGrid">
      <Stat icon={<Building2 />} label="Sites" value={data.sites.length} />
      <Stat icon={<CalendarDays />} label="Visits" value={visitCount} />
      <Stat icon={<ShieldAlert />} label="Known Issues" value={data.sites.filter(s => s.knownIssues?.trim()).length} />
    </div>
    <h3 className="sectionTitle">Recent Sites</h3>
    {recent.length ? recent.map(site => <SiteCard key={site.id} site={site} onClick={() => onOpenSite(site.id)} />) : <EmptyState title="No sites yet" text="Add your first customer site to begin building the vault." />}
  </section>;
}

function Stat({ icon, label, value }) {
  return <div className="stat"><div>{React.cloneElement(icon, { size: 20 })}</div><strong>{value}</strong><span>{label}</span></div>;
}

function Sites({ sites, query, setQuery, onAdd, onOpen }) {
  return <section className="page">
    <div className="pageHeader"><div><p className="eyebrow">Customer memory</p><h2>Sites</h2></div><button className="primary small" onClick={onAdd}><Plus size={18}/> Add</button></div>
    <div className="searchBox"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by customer, address, panel, issue..." /></div>
    <div className="list">{sites.map(site => <SiteCard key={site.id} site={site} onClick={() => onOpen(site.id)} />)}</div>
    {!sites.length && <EmptyState title="No matching sites" text="Try another search or add a new site." />}
  </section>;
}

function SiteCard({ site, onClick }) {
  return <button className="siteCard" onClick={onClick}>
    <div className="siteIcon"><Building2 size={22}/></div>
    <div className="siteSummary"><strong>{site.name}</strong><span>{site.address || 'No address saved'}</span><em>{[site.panelManufacturer, site.panelModel].filter(Boolean).join(' ') || 'Panel info not entered'}</em></div>
    {site.knownIssues?.trim() && <div className="issueBadge"><AlertTriangle size={15}/> Issue</div>}
  </button>;
}

function SiteDetail({ site, onEdit, onDelete, onAddVisit }) {
  const [visitTitle, setVisitTitle] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0,10));

  function submitVisit(e) {
    e.preventDefault();
    if (!visitNotes.trim() && !visitTitle.trim()) return;
    onAddVisit({ date: visitDate, title: visitTitle || 'Service visit', notes: visitNotes });
    setVisitTitle(''); setVisitNotes(''); setVisitDate(new Date().toISOString().slice(0,10));
  }

  return <section className="page">
    <div className="detailTop">
      <div><p className="eyebrow">Site vault</p><h2>{site.name}</h2><p className="muted"><MapPin size={15}/> {site.address || 'No address saved'}</p></div>
      <div className="row"><button className="secondary small" onClick={onEdit}>Edit</button><button className="danger small" onClick={onDelete}><Trash2 size={16}/></button></div>
    </div>
    <div className="infoGrid">
      <InfoCard title="Customer" icon={<Building2 />} lines={[site.customer, site.contact, site.phone]} />
      <InfoCard title="Fire Alarm System" icon={<Bell />} lines={[site.panelManufacturer, site.panelModel, site.communicator, site.monitoringAccount && `Monitoring: ${site.monitoringAccount}`]} />
      <InfoCard title="Access Notes" icon={<ClipboardList />} lines={[site.accessNotes]} />
      <InfoCard title="Known Issues" icon={<AlertTriangle />} alert lines={[site.knownIssues]} />
      <InfoCard title="General Notes" icon={<FileText />} lines={[site.generalNotes]} />
    </div>
    <div className="panel">
      <h3>Add Visit Note</h3>
      <form onSubmit={submitVisit} className="visitForm">
        <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
        <input value={visitTitle} onChange={e => setVisitTitle(e.target.value)} placeholder="Visit title, e.g. Ground fault NAC 2" />
        <textarea value={visitNotes} onChange={e => setVisitNotes(e.target.value)} placeholder="What did you find? What should the next technician know?" />
        <button className="primary" type="submit"><Save size={18}/> Save Visit</button>
      </form>
    </div>
    <div className="panel">
      <h3>Visit History</h3>
      {(site.visits || []).length ? site.visits.map(v => <div className="visit" key={v.id}><strong>{v.date} — {v.title}</strong><p>{v.notes}</p></div>) : <p className="muted">No visit history yet.</p>}
    </div>
  </section>;
}

function InfoCard({ title, icon, lines, alert }) {
  const clean = (lines || []).filter(Boolean);
  return <div className={`infoCard ${alert ? 'alert' : ''}`}><h3>{React.cloneElement(icon, { size: 18 })}{title}</h3>{clean.length ? clean.map((line, idx) => <p key={idx}>{line}</p>) : <p className="muted">Not entered.</p>}</div>;
}

function EditSite({ site, onCancel, onSave }) {
  const [form, setForm] = useState(site);
  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })); }
  function submit(e) { e.preventDefault(); if (!form.name.trim()) return alert('Site name is required.'); onSave(form); }
  return <section className="page">
    <div className="pageHeader"><div><p className="eyebrow">Site record</p><h2>{site.createdAt ? 'Edit Site' : 'Add Site'}</h2></div></div>
    <form className="editForm" onSubmit={submit}>
      <Field label="Site Name" value={form.name} onChange={v => set('name', v)} required />
      <Field label="Customer / Account" value={form.customer} onChange={v => set('customer', v)} />
      <Field label="Address" value={form.address} onChange={v => set('address', v)} />
      <Field label="Contact" value={form.contact} onChange={v => set('contact', v)} />
      <Field label="Phone" value={form.phone} onChange={v => set('phone', v)} />
      <div className="twoCol"><Field label="Panel Manufacturer" value={form.panelManufacturer} onChange={v => set('panelManufacturer', v)} /><Field label="Panel Model" value={form.panelModel} onChange={v => set('panelModel', v)} /></div>
      <Field label="Communicator" value={form.communicator} onChange={v => set('communicator', v)} />
      <Field label="Monitoring Account" value={form.monitoringAccount} onChange={v => set('monitoringAccount', v)} />
      <TextField label="Access Notes" value={form.accessNotes} onChange={v => set('accessNotes', v)} />
      <TextField label="Known Issues" value={form.knownIssues} onChange={v => set('knownIssues', v)} />
      <TextField label="General Notes" value={form.generalNotes} onChange={v => set('generalNotes', v)} />
      <div className="formActions"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button className="primary" type="submit"><Save size={18}/> Save Site</button></div>
    </form>
  </section>;
}

function Field({ label, value, onChange, required }) {
  return <label className="field"><span>{label}</span><input required={required} value={value || ''} onChange={e => onChange(e.target.value)} /></label>;
}
function TextField({ label, value, onChange }) {
  return <label className="field"><span>{label}</span><textarea value={value || ''} onChange={e => onChange(e.target.value)} /></label>;
}
function Resources({ resources }) {
  return <section className="page"><div className="pageHeader"><div><p className="eyebrow">Reference library</p><h2>Resources</h2></div></div>{resources.map(r => <div className="resource" key={r.id}><Wrench size={20}/><div><strong>{r.maker}</strong><span>{r.title}</span><p>{r.note}</p></div></div>)}</section>;
}
function SettingsPage({ onExport, onImport, siteCount }) {
  return <section className="page"><div className="pageHeader"><div><p className="eyebrow">Data control</p><h2>Settings</h2></div></div><div className="panel"><h3>Local data</h3><p className="muted">FireVault is currently local-first. Your records are saved in this browser until Firebase/cloud sync is added.</p><p><strong>{siteCount}</strong> sites stored locally.</p><div className="heroActions"><button className="primary" onClick={onExport}><Download size={18}/> Export Backup</button><label className="secondary fileButton"><Upload size={18}/> Import Backup<input type="file" accept="application/json" onChange={e => onImport(e.target.files?.[0])} /></label></div></div></section>;
}
function EmptyState({ title, text }) { return <div className="empty"><strong>{title}</strong><p>{text}</p></div>; }
function newSite() { return { id: crypto.randomUUID(), name: '', address: '', customer: '', contact: '', phone: '', panelManufacturer: '', panelModel: '', communicator: '', monitoringAccount: '', accessNotes: '', knownIssues: '', generalNotes: '', visits: [] }; }

createRoot(document.getElementById('root')).render(<App />);
