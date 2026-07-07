import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle, Bell, BookOpen, Building2, CalendarDays, ClipboardList, Download,
  Flame, Home, MapPin, Plus, Save, Search, Settings, ShieldAlert, Trash2, Upload,
  UserRound, Wrench, X, Tag, FileText, KeyRound, RadioTower
} from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'firevault2_data_v3';

function makeId() {
  return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

const demoSite = {
  id: makeId(),
  name: 'Demo Site - Lincoln School',
  customer: 'Lincoln School District',
  address: '123 Main St, Casper, WY',
  latitude: '',
  longitude: '',
  contacts: [
    { id: makeId(), name: 'Facilities Office', role: 'Main contact', phone: '', email: '', notes: 'Ask front desk for electrical room access.' }
  ],
  access: {
    instructions: 'Main FACP is in the electrical room near the office. Check in at front desk.',
    keyLocation: 'Front desk / maintenance office',
    gateCode: '',
    lockbox: ''
  },
  system: {
    manufacturer: 'Fire-Lite',
    model: 'MS-9200UDLS',
    firmware: '',
    communicator: 'Cell dialer',
    monitoringAccount: '',
    boosterPanels: 'Booster panel above ceiling near gym entrance.',
    annunciators: 'Main entry vestibule.',
    powerSupplies: '',
    elevatorRecall: '',
    voiceEvac: 'No',
    inspectionCompany: ''
  },
  knownIssues: [
    { id: makeId(), title: 'NAC 2 intermittent ground fault after rain', severity: 'High', status: 'Open', tags: ['Ground Fault', 'NAC', 'Water'], notes: 'Check exterior horn/strobes first. Previous visit found moisture suspected near east entrance device.', createdAt: new Date().toISOString() }
  ],
  visits: [
    { id: makeId(), date: new Date().toISOString().slice(0,10), title: 'Demo previous service visit', tags: ['Ground Fault', 'NAC'], notes: 'Checked intermittent NAC trouble. Panel normal on arrival. Recommend inspecting exterior devices if trouble returns.', createdAt: new Date().toISOString() }
  ],
  generalNotes: 'Annual inspection photos should be added next visit.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const defaultData = {
  sites: [demoSite],
  resources: [
    { id: makeId(), maker: 'Fire-Lite', title: 'Panel manuals and programming notes', note: 'Add links and your own quick notes here.' },
    { id: makeId(), maker: 'Silent Knight', title: 'Common trouble references', note: 'Add walk-test and reset procedures.' },
    { id: makeId(), maker: 'Notifier', title: 'Field notes', note: 'Add customer-specific observations or public manual links.' }
  ]
};

function normalizeSite(site) {
  return {
    id: site.id || makeId(),
    name: site.name || '',
    customer: site.customer || '',
    address: site.address || '',
    latitude: site.latitude || '',
    longitude: site.longitude || '',
    contacts: Array.isArray(site.contacts) ? site.contacts : [],
    access: site.access || { instructions: site.accessNotes || '', keyLocation: '', gateCode: '', lockbox: '' },
    system: site.system || {
      manufacturer: site.panelManufacturer || '', model: site.panelModel || '', firmware: '', communicator: site.communicator || '', monitoringAccount: site.monitoringAccount || '', boosterPanels: '', annunciators: '', powerSupplies: '', elevatorRecall: '', voiceEvac: '', inspectionCompany: ''
    },
    knownIssues: Array.isArray(site.knownIssues) ? site.knownIssues : (site.knownIssues ? [{ id: makeId(), title: site.knownIssues, severity: 'Medium', status: 'Open', tags: [], notes: '', createdAt: new Date().toISOString() }] : []),
    visits: Array.isArray(site.visits) ? site.visits : [],
    generalNotes: site.generalNotes || '',
    createdAt: site.createdAt || new Date().toISOString(),
    updatedAt: site.updatedAt || new Date().toISOString()
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('firevault2_data_v2');
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    return {
      sites: (parsed.sites || []).map(normalizeSite),
      resources: parsed.resources || defaultData.resources
    };
  } catch {
    return defaultData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function blankSite() {
  return normalizeSite({ id: makeId(), name: '', contacts: [], knownIssues: [], visits: [] });
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
    const q = query.trim().toLowerCase();
    if (!q) return data.sites;
    return data.sites.filter(site => JSON.stringify(site).toLowerCase().includes(q));
  }, [data.sites, query]);

  function upsertSite(site) {
    const now = new Date().toISOString();
    const nextSite = { ...normalizeSite(site), updatedAt: now, createdAt: site.createdAt || now };
    setData(prev => ({
      ...prev,
      sites: prev.sites.some(s => s.id === nextSite.id) ? prev.sites.map(s => s.id === nextSite.id ? nextSite : s) : [nextSite, ...prev.sites]
    }));
    setSelectedSiteId(nextSite.id);
    setEditingSite(null);
    setTab('siteDetail');
  }

  function updateSite(id, patcher) {
    setData(prev => ({
      ...prev,
      sites: prev.sites.map(site => site.id === id ? { ...patcher(site), updatedAt: new Date().toISOString() } : site)
    }));
  }

  function deleteSite(id) {
    if (!confirm('Delete this site and all visit history?')) return;
    setData(prev => ({ ...prev, sites: prev.sites.filter(s => s.id !== id) }));
    setSelectedSiteId(null);
    setTab('sites');
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
        setData({ sites: imported.sites.map(normalizeSite), resources: imported.resources || [] });
        alert('Backup imported.');
      } catch {
        alert('Could not import this file.');
      }
    };
    reader.readAsText(file);
  }

  return <div className="app">
    <Header />
    <main className="main">
      {tab === 'dashboard' && <Dashboard data={data} onAddSite={() => { setEditingSite(blankSite()); setTab('editSite'); }} onOpenSites={() => setTab('sites')} onOpenSite={(id) => { setSelectedSiteId(id); setTab('siteDetail'); }} />}
      {tab === 'sites' && <Sites sites={filteredSites} query={query} setQuery={setQuery} onAdd={() => { setEditingSite(blankSite()); setTab('editSite'); }} onOpen={(id) => { setSelectedSiteId(id); setTab('siteDetail'); }} />}
      {tab === 'siteDetail' && selectedSite && <SiteDetail site={selectedSite} onEdit={() => { setEditingSite(selectedSite); setTab('editSite'); }} onDelete={() => deleteSite(selectedSite.id)} updateSite={updateSite} />}
      {tab === 'siteDetail' && !selectedSite && <EmptyState title="No site selected" text="Open the Sites tab and choose a customer site." />}
      {tab === 'editSite' && editingSite && <EditSite site={editingSite} onCancel={() => { setEditingSite(null); setTab(selectedSite ? 'siteDetail' : 'sites'); }} onSave={upsertSite} />}
      {tab === 'resources' && <Resources resources={data.resources} />}
      {tab === 'settings' && <SettingsPage siteCount={data.sites.length} onExport={exportData} onImport={importData} />}
    </main>
    <BottomNav tab={tab} setTab={setTab} />
  </div>;
}

function Header() {
  return <header className="header"><div className="brandMark"><Flame size={22} /></div><div><h1>FireVault</h1><p>Site intelligence for fire alarm technicians</p></div></header>;
}

function BottomNav({ tab, setTab }) {
  return <nav className="bottomNav">
    <NavButton icon={<Home />} label="Today" active={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
    <NavButton icon={<Building2 />} label="Sites" active={['sites','siteDetail','editSite'].includes(tab)} onClick={() => setTab('sites')} />
    <NavButton icon={<BookOpen />} label="Library" active={tab === 'resources'} onClick={() => setTab('resources')} />
    <NavButton icon={<Settings />} label="Settings" active={tab === 'settings'} onClick={() => setTab('settings')} />
  </nav>;
}

function NavButton({ icon, label, active, onClick }) {
  return <button className={`navButton ${active ? 'active' : ''}`} onClick={onClick}>{React.cloneElement(icon, { size: 20 })}<span>{label}</span></button>;
}

function Dashboard({ data, onAddSite, onOpenSites, onOpenSite }) {
  const recent = data.sites.slice(0, 3);
  const visitCount = data.sites.reduce((n, s) => n + (s.visits?.length || 0), 0);
  const issueCount = data.sites.reduce((n, s) => n + (s.knownIssues?.filter(i => i.status !== 'Closed').length || 0), 0);
  return <section className="page">
    <div className="heroCard">
      <p className="eyebrow">Good day, David</p>
      <h2>What should the next technician know?</h2>
      <p>FireVault stores customer site memory: panels, access notes, known issues, visit history, contacts, and technician discoveries.</p>
      <div className="heroActions"><button className="primary" onClick={onAddSite}><Plus size={18}/> Add Site</button><button className="secondary" onClick={onOpenSites}><Search size={18}/> Search Sites</button></div>
    </div>
    <div className="statsGrid">
      <Stat icon={<Building2 />} label="Sites" value={data.sites.length} />
      <Stat icon={<CalendarDays />} label="Visits" value={visitCount} />
      <Stat icon={<ShieldAlert />} label="Open Issues" value={issueCount} />
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
    <div className="searchBox"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customer, panel, issue, tag, address..." /></div>
    <div className="list">{sites.map(site => <SiteCard key={site.id} site={site} onClick={() => onOpen(site.id)} />)}</div>
    {!sites.length && <EmptyState title="No matching sites" text="Try another search or add a new site." />}
  </section>;
}

function SiteCard({ site, onClick }) {
  const openIssues = site.knownIssues?.filter(i => i.status !== 'Closed').length || 0;
  const panel = [site.system?.manufacturer, site.system?.model].filter(Boolean).join(' ') || 'Panel info not entered';
  return <button className="siteCard" onClick={onClick}>
    <div className="siteIcon"><Building2 size={22}/></div>
    <div className="siteSummary"><strong>{site.name}</strong><span>{site.address || 'No address saved'}</span><em>{panel}</em></div>
    {openIssues > 0 && <div className="issueBadge"><AlertTriangle size={15}/> {openIssues}</div>}
  </button>;
}

function SiteDetail({ site, onEdit, onDelete, updateSite }) {
  const [section, setSection] = useState('overview');
  return <section className="page">
    <div className="detailTop">
      <div><p className="eyebrow">Site vault</p><h2>{site.name}</h2><p className="muted inline"><MapPin size={15}/> {site.address || 'No address saved'}</p></div>
      <div className="row tight"><button className="secondary small" onClick={onEdit}>Edit</button><button className="danger small" onClick={onDelete}><Trash2 size={16}/></button></div>
    </div>
    <div className="tabStrip">
      {['overview','visits','issues','equipment','contacts'].map(key => <button key={key} className={section === key ? 'active' : ''} onClick={() => setSection(key)}>{key === 'issues' ? 'Known Issues' : key[0].toUpperCase() + key.slice(1)}</button>)}
    </div>
    {section === 'overview' && <Overview site={site} />}
    {section === 'visits' && <Visits site={site} updateSite={updateSite} />}
    {section === 'issues' && <KnownIssues site={site} updateSite={updateSite} />}
    {section === 'equipment' && <Equipment site={site} />}
    {section === 'contacts' && <ContactsAccess site={site} />}
  </section>;
}

function Overview({ site }) {
  const lastVisit = site.visits?.[0];
  return <>
    <div className="infoGrid">
      <InfoCard title="Fire Alarm System" icon={<Bell />} lines={[site.system?.manufacturer, site.system?.model, site.system?.communicator && `Communicator: ${site.system.communicator}`, site.system?.monitoringAccount && `Monitoring: ${site.system.monitoringAccount}`]} />
      <InfoCard title="Known Issues" icon={<AlertTriangle />} alert lines={(site.knownIssues || []).filter(i => i.status !== 'Closed').slice(0,3).map(i => `${i.severity} — ${i.title}`)} />
      <InfoCard title="Access" icon={<KeyRound />} lines={[site.access?.instructions, site.access?.keyLocation && `Key: ${site.access.keyLocation}`, site.access?.lockbox && `Lockbox: ${site.access.lockbox}`]} />
      <InfoCard title="Last Visit" icon={<CalendarDays />} lines={lastVisit ? [`${lastVisit.date} — ${lastVisit.title}`, lastVisit.notes] : []} />
      <InfoCard title="General Notes" icon={<FileText />} lines={[site.generalNotes]} />
    </div>
  </>;
}

function Visits({ site, updateSite }) {
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), title: '', tags: '', notes: '' });
  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() && !form.notes.trim()) return;
    const visit = { id: makeId(), date: form.date, title: form.title || 'Service visit', tags: splitTags(form.tags), notes: form.notes, createdAt: new Date().toISOString() };
    updateSite(site.id, s => ({ ...s, visits: [visit, ...(s.visits || [])] }));
    setForm({ date: new Date().toISOString().slice(0,10), title: '', tags: '', notes: '' });
  }
  return <div className="panel">
    <h3>Add Visit Note</h3>
    <form onSubmit={submit} className="visitForm">
      <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
      <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Visit title, e.g. Ground fault NAC 2" />
      <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="Tags, e.g. Ground Fault, NAC, Battery" />
      <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="What did you find? What should the next technician know?" />
      <button className="primary" type="submit"><Save size={18}/> Save Visit</button>
    </form>
    <h3 className="subhead">Visit History</h3>
    {(site.visits || []).length ? site.visits.map(v => <div className="visit" key={v.id}><strong>{v.date} — {v.title}</strong><TagList tags={v.tags} /><p>{v.notes}</p></div>) : <p className="muted">No visit history yet.</p>}
  </div>;
}

function KnownIssues({ site, updateSite }) {
  const [issue, setIssue] = useState({ title: '', severity: 'Medium', status: 'Open', tags: '', notes: '' });
  function addIssue(e) {
    e.preventDefault();
    if (!issue.title.trim()) return;
    const next = { ...issue, id: makeId(), tags: splitTags(issue.tags), createdAt: new Date().toISOString() };
    updateSite(site.id, s => ({ ...s, knownIssues: [next, ...(s.knownIssues || [])] }));
    setIssue({ title: '', severity: 'Medium', status: 'Open', tags: '', notes: '' });
  }
  function closeIssue(id) {
    updateSite(site.id, s => ({ ...s, knownIssues: s.knownIssues.map(i => i.id === id ? { ...i, status: i.status === 'Closed' ? 'Open' : 'Closed' } : i) }));
  }
  return <div className="panel">
    <h3>Add Known Issue</h3>
    <form onSubmit={addIssue} className="visitForm">
      <input value={issue.title} onChange={e => setIssue({...issue, title: e.target.value})} placeholder="Example: NAC 2 ground fault after rain" />
      <div className="twoCol"><select value={issue.severity} onChange={e => setIssue({...issue, severity: e.target.value})}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select><select value={issue.status} onChange={e => setIssue({...issue, status: e.target.value})}><option>Open</option><option>Watching</option><option>Closed</option></select></div>
      <input value={issue.tags} onChange={e => setIssue({...issue, tags: e.target.value})} placeholder="Tags, e.g. Water, NAC, False Alarm" />
      <textarea value={issue.notes} onChange={e => setIssue({...issue, notes: e.target.value})} placeholder="Details, location, suspected cause, next steps..." />
      <button className="primary" type="submit"><Save size={18}/> Save Issue</button>
    </form>
    <h3 className="subhead">Known Issues</h3>
    {(site.knownIssues || []).length ? site.knownIssues.map(i => <div className={`issueItem ${i.status === 'Closed' ? 'closed' : ''}`} key={i.id}>
      <div className="issueTop"><strong>{i.title}</strong><button className="secondary micro" onClick={() => closeIssue(i.id)}>{i.status}</button></div>
      <span className="severity">{i.severity}</span><TagList tags={i.tags} /><p>{i.notes}</p>
    </div>) : <p className="muted">No known issues yet.</p>}
  </div>;
}

function Equipment({ site }) {
  const sys = site.system || {};
  return <div className="infoGrid">
    <InfoCard title="Main Panel" icon={<Bell />} lines={[sys.manufacturer, sys.model, sys.firmware && `Firmware: ${sys.firmware}`]} />
    <InfoCard title="Communication" icon={<RadioTower />} lines={[sys.communicator, sys.monitoringAccount && `Monitoring Account: ${sys.monitoringAccount}`]} />
    <InfoCard title="Booster / Power Supplies" icon={<Wrench />} lines={[sys.boosterPanels, sys.powerSupplies]} />
    <InfoCard title="Annunciators / Network" icon={<ClipboardList />} lines={[sys.annunciators]} />
    <InfoCard title="Special Systems" icon={<ShieldAlert />} lines={[sys.elevatorRecall && `Elevator Recall: ${sys.elevatorRecall}`, sys.voiceEvac && `Voice Evac: ${sys.voiceEvac}`]} />
    <InfoCard title="Inspection" icon={<FileText />} lines={[sys.inspectionCompany]} />
  </div>;
}

function ContactsAccess({ site }) {
  return <div className="infoGrid">
    <InfoCard title="Access Instructions" icon={<KeyRound />} lines={[site.access?.instructions, site.access?.keyLocation && `Key Location: ${site.access.keyLocation}`, site.access?.gateCode && `Gate Code: ${site.access.gateCode}`, site.access?.lockbox && `Lockbox: ${site.access.lockbox}`]} />
    {(site.contacts || []).length ? site.contacts.map(c => <InfoCard key={c.id} title={c.name || 'Contact'} icon={<UserRound />} lines={[c.role, c.phone, c.email, c.notes]} />) : <InfoCard title="Contacts" icon={<UserRound />} lines={[]} />}
  </div>;
}

function InfoCard({ title, icon, lines, alert }) {
  const clean = (lines || []).filter(Boolean);
  return <div className={`infoCard ${alert ? 'alert' : ''}`}><h3>{React.cloneElement(icon, { size: 18 })}{title}</h3>{clean.length ? clean.map((line, idx) => <p key={idx}>{line}</p>) : <p className="muted">Not entered.</p>}</div>;
}

function TagList({ tags }) {
  const clean = (tags || []).filter(Boolean);
  if (!clean.length) return null;
  return <div className="tags">{clean.map(t => <span key={t}><Tag size={12}/>{t}</span>)}</div>;
}

function splitTags(value) {
  if (Array.isArray(value)) return value;
  return value.split(',').map(t => t.trim()).filter(Boolean);
}

function EditSite({ site, onCancel, onSave }) {
  const [form, setForm] = useState(site);
  function set(path, value) {
    setForm(prev => {
      const copy = structuredClone(prev);
      const parts = path.split('.');
      let obj = copy;
      while (parts.length > 1) obj = obj[parts.shift()];
      obj[parts[0]] = value;
      return copy;
    });
  }
  function submit(e) { e.preventDefault(); if (!form.name.trim()) return alert('Site name is required.'); onSave(form); }
  return <section className="page">
    <div className="pageHeader"><div><p className="eyebrow">Site record</p><h2>{site.createdAt ? 'Edit Site' : 'Add Site'}</h2></div></div>
    <form className="editForm" onSubmit={submit}>
      <Field label="Site Name" value={form.name} onChange={v => set('name', v)} required />
      <Field label="Customer / Account" value={form.customer} onChange={v => set('customer', v)} />
      <Field label="Address" value={form.address} onChange={v => set('address', v)} />
      <div className="twoCol"><Field label="Latitude" value={form.latitude} onChange={v => set('latitude', v)} /><Field label="Longitude" value={form.longitude} onChange={v => set('longitude', v)} /></div>
      <div className="twoCol"><Field label="Panel Manufacturer" value={form.system.manufacturer} onChange={v => set('system.manufacturer', v)} /><Field label="Panel Model" value={form.system.model} onChange={v => set('system.model', v)} /></div>
      <div className="twoCol"><Field label="Firmware" value={form.system.firmware} onChange={v => set('system.firmware', v)} /><Field label="Communicator" value={form.system.communicator} onChange={v => set('system.communicator', v)} /></div>
      <Field label="Monitoring Account" value={form.system.monitoringAccount} onChange={v => set('system.monitoringAccount', v)} />
      <Field label="Booster Panels" value={form.system.boosterPanels} onChange={v => set('system.boosterPanels', v)} textarea />
      <Field label="Power Supplies" value={form.system.powerSupplies} onChange={v => set('system.powerSupplies', v)} textarea />
      <Field label="Annunciators" value={form.system.annunciators} onChange={v => set('system.annunciators', v)} textarea />
      <Field label="Elevator Recall" value={form.system.elevatorRecall} onChange={v => set('system.elevatorRecall', v)} textarea />
      <Field label="Voice Evacuation" value={form.system.voiceEvac} onChange={v => set('system.voiceEvac', v)} />
      <Field label="Inspection Company" value={form.system.inspectionCompany} onChange={v => set('system.inspectionCompany', v)} />
      <Field label="Access Instructions" value={form.access.instructions} onChange={v => set('access.instructions', v)} textarea />
      <div className="twoCol"><Field label="Key Location" value={form.access.keyLocation} onChange={v => set('access.keyLocation', v)} /><Field label="Lockbox" value={form.access.lockbox} onChange={v => set('access.lockbox', v)} /></div>
      <Field label="Gate / Door Code" value={form.access.gateCode} onChange={v => set('access.gateCode', v)} />
      <Field label="General Notes" value={form.generalNotes} onChange={v => set('generalNotes', v)} textarea />
      <div className="formActions"><button className="secondary" type="button" onClick={onCancel}>Cancel</button><button className="primary" type="submit"><Save size={18}/> Save Site</button></div>
    </form>
  </section>;
}

function Field({ label, value, onChange, textarea, required }) {
  return <label className="field"><span>{label}</span>{textarea ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} required={required} /> : <input value={value || ''} onChange={e => onChange(e.target.value)} required={required} />}</label>;
}

function Resources({ resources }) {
  return <section className="page">
    <div className="pageHeader"><div><p className="eyebrow">Reference library</p><h2>Resources</h2></div></div>
    {resources.map(r => <div className="resource" key={r.id}><BookOpen size={22}/><div><strong>{r.maker}</strong><span>{r.title}</span><p>{r.note}</p></div></div>)}
  </section>;
}

function SettingsPage({ siteCount, onExport, onImport }) {
  return <section className="page">
    <div className="pageHeader"><div><p className="eyebrow">Local-first</p><h2>Settings</h2></div></div>
    <div className="panel"><h3>Backup</h3><p className="muted">FireVault is currently storing {siteCount} site record(s) locally in this browser.</p><div className="heroActions"><button className="primary" onClick={onExport}><Download size={18}/> Export Backup</button><label className="secondary fileButton"><Upload size={18}/> Import Backup<input type="file" accept="application/json" onChange={e => onImport(e.target.files?.[0])}/></label></div></div>
  </section>;
}

function EmptyState({ title, text }) {
  return <div className="empty"><strong>{title}</strong><p>{text}</p></div>;
}

createRoot(document.getElementById('root')).render(<App />);
