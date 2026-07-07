import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Building2, CalendarClock, FileText, Home, MapPin, Plus, Search, Shield, Wrench, Download, Upload, Trash2, Save, ArrowLeft } from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'firevault_v1_data';

const emptyData = {
  sites: [],
  visits: [],
  resources: [
    { id: crypto.randomUUID(), maker: 'Fire-Lite', title: 'Panel manuals and quick notes', url: '', note: 'Add links to official manuals, programming notes, and common trouble references.' },
    { id: crypto.randomUUID(), maker: 'Silent Knight', title: 'Panel manuals and quick notes', url: '', note: 'Add links to official manuals, programming notes, and common trouble references.' },
    { id: crypto.randomUUID(), maker: 'Notifier', title: 'Panel manuals and quick notes', url: '', note: 'Add links to official manuals, programming notes, and common trouble references.' },
    { id: crypto.randomUUID(), maker: 'Edwards / EST', title: 'Panel manuals and quick notes', url: '', note: 'Add links to official manuals, programming notes, and common trouble references.' },
    { id: crypto.randomUUID(), maker: 'Potter', title: 'Panel manuals and quick notes', url: '', note: 'Add links to official manuals, programming notes, and common trouble references.' }
  ]
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw);
    return { ...emptyData, ...parsed };
  } catch {
    return emptyData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function nowLocalInput() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function formatDateTime(value) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState('today');
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [editingSiteId, setEditingSiteId] = useState(null);

  useEffect(() => saveData(data), [data]);

  const selectedSite = data.sites.find(s => s.id === selectedSiteId);

  function upsertSite(site) {
    setData(prev => {
      const exists = prev.sites.some(s => s.id === site.id);
      const sites = exists ? prev.sites.map(s => s.id === site.id ? site : s) : [site, ...prev.sites];
      return { ...prev, sites };
    });
    setSelectedSiteId(site.id);
    setEditingSiteId(null);
    setTab('siteDetail');
  }

  function deleteSite(id) {
    setData(prev => ({ ...prev, sites: prev.sites.filter(s => s.id !== id), visits: prev.visits.filter(v => v.siteId !== id) }));
    setSelectedSiteId(null);
    setTab('sites');
  }

  function addVisit(visit) {
    setData(prev => ({ ...prev, visits: [visit, ...prev.visits] }));
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firevault-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.sites || !parsed.visits) throw new Error('Invalid backup');
        setData({ ...emptyData, ...parsed });
        alert('Backup imported.');
      } catch {
        alert('That backup file could not be imported.');
      }
    };
    reader.readAsText(file);
  }

  return <div className="app">
    <header className="topbar">
      <div className="brandMark"><Shield size={22}/></div>
      <div><h1>FireVault</h1><p>Site memory for fire alarm technicians</p></div>
    </header>

    <main className="content">
      {tab === 'today' && <Today data={data} setTab={setTab} setSelectedSiteId={setSelectedSiteId} />}
      {tab === 'sites' && <Sites sites={data.sites} setTab={setTab} setSelectedSiteId={setSelectedSiteId} setEditingSiteId={setEditingSiteId} />}
      {tab === 'addSite' && <SiteForm onSave={upsertSite} onCancel={() => setTab('sites')} />}
      {tab === 'editSite' && <SiteForm site={data.sites.find(s => s.id === editingSiteId)} onSave={upsertSite} onCancel={() => setTab('siteDetail')} />}
      {tab === 'siteDetail' && selectedSite && <SiteDetail site={selectedSite} visits={data.visits.filter(v => v.siteId === selectedSite.id)} onBack={() => setTab('sites')} onEdit={() => {setEditingSiteId(selectedSite.id); setTab('editSite')}} onDelete={() => deleteSite(selectedSite.id)} onAddVisit={addVisit} />}
      {tab === 'resources' && <Resources data={data} setData={setData} />}
      {tab === 'settings' && <Settings exportBackup={exportBackup} importBackup={importBackup} />}
    </main>

    <nav className="bottomNav">
      <button className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}><Home/>Today</button>
      <button className={tab === 'sites' || tab === 'siteDetail' || tab === 'addSite' || tab === 'editSite' ? 'active' : ''} onClick={() => setTab('sites')}><Building2/>Sites</button>
      <button className={tab === 'resources' ? 'active' : ''} onClick={() => setTab('resources')}><FileText/>Library</button>
      <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}><Wrench/>Settings</button>
    </nav>
  </div>;
}

function Today({ data, setTab, setSelectedSiteId }) {
  const today = new Date().toISOString().slice(0,10);
  const todayVisits = data.visits.filter(v => v.startedAt?.slice(0,10) === today);
  return <section>
    <div className="heroCard">
      <p className="eyebrow">Good day, David</p>
      <h2>What did we learn at a site today?</h2>
      <p>Start by opening a customer site or adding a new one. Every visit note becomes permanent site memory.</p>
      <div className="heroActions">
        <button className="primary" onClick={() => setTab('sites')}><Search size={18}/> Search Sites</button>
        <button onClick={() => setTab('addSite')}><Plus size={18}/> Add Site</button>
      </div>
    </div>
    <div className="grid2">
      <Metric title="Customer Sites" value={data.sites.length} />
      <Metric title="Today's Visits" value={todayVisits.length} />
    </div>
    <h3>Recent Sites</h3>
    {data.sites.length === 0 ? <Empty text="No sites yet. Add your first customer building." /> : data.sites.slice(0,5).map(site => <Card key={site.id} onClick={() => {setSelectedSiteId(site.id); setTab('siteDetail')}} title={site.name} subtitle={site.address || 'No address saved'} right={site.panelMaker || 'Site'} />)}
  </section>;
}

function Metric({ title, value }) { return <div className="metric"><span>{title}</span><strong>{value}</strong></div>; }
function Empty({ text }) { return <div className="empty">{text}</div>; }
function Card({ title, subtitle, right, onClick }) { return <button className="card" onClick={onClick}><div><strong>{title}</strong><span>{subtitle}</span></div><em>{right}</em></button>; }

function Sites({ sites, setTab, setSelectedSiteId, setEditingSiteId }) {
  const [q, setQ] = useState('');
  const filtered = sites.filter(s => [s.name, s.address, s.panelMaker, s.panelModel, s.notes].join(' ').toLowerCase().includes(q.toLowerCase()));
  return <section>
    <div className="sectionHeader"><div><h2>Sites</h2><p>Customer buildings and permanent history.</p></div><button className="primary" onClick={() => {setEditingSiteId(null); setTab('addSite')}}><Plus size={18}/> Add</button></div>
    <label className="searchBox"><Search size={18}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search customer, address, panel, notes..." /></label>
    {filtered.length === 0 ? <Empty text="No matching sites." /> : filtered.map(site => <Card key={site.id} onClick={() => {setSelectedSiteId(site.id); setTab('siteDetail')}} title={site.name} subtitle={`${site.address || 'No address'} • ${site.panelMaker || 'Panel maker not set'} ${site.panelModel || ''}`} right="Open" />)}
  </section>;
}

function SiteForm({ site, onSave, onCancel }) {
  const [form, setForm] = useState(site || { id: crypto.randomUUID(), name: '', address: '', lat: '', lng: '', panelMaker: '', panelModel: '', communicator: '', contacts: '', access: '', notes: '', createdAt: new Date().toISOString() });
  function update(field, value) { setForm(prev => ({ ...prev, [field]: value, updatedAt: new Date().toISOString() })); }
  return <section>
    <button className="textButton" onClick={onCancel}><ArrowLeft size={16}/> Back</button>
    <h2>{site ? 'Edit Site' : 'Add Site'}</h2>
    <div className="form">
      <Input label="Customer / Site Name" value={form.name} onChange={v => update('name', v)} required />
      <Input label="Address" value={form.address} onChange={v => update('address', v)} />
      <div className="grid2"><Input label="Latitude" value={form.lat} onChange={v => update('lat', v)} /><Input label="Longitude" value={form.lng} onChange={v => update('lng', v)} /></div>
      <div className="grid2"><Input label="Panel Manufacturer" value={form.panelMaker} onChange={v => update('panelMaker', v)} placeholder="Fire-Lite, Silent Knight..." /><Input label="Panel Model" value={form.panelModel} onChange={v => update('panelModel', v)} /></div>
      <Input label="Communicator / Monitoring" value={form.communicator} onChange={v => update('communicator', v)} />
      <Textarea label="Contacts" value={form.contacts} onChange={v => update('contacts', v)} placeholder="Names, phone numbers, after-hours contacts" />
      <Textarea label="Access Instructions" value={form.access} onChange={v => update('access', v)} placeholder="FACP location, keys, lock box, gate code, annunciator" />
      <Textarea label="Permanent Site Notes" value={form.notes} onChange={v => update('notes', v)} placeholder="Known quirks, recurring troubles, wiring notes" />
      <button className="primary full" onClick={() => form.name.trim() ? onSave(form) : alert('Site name is required.')}><Save size={18}/> Save Site</button>
    </div>
  </section>;
}

function Input({ label, value, onChange, placeholder }) { return <label className="field"><span>{label}</span><input value={value || ''} placeholder={placeholder || ''} onChange={e => onChange(e.target.value)} /></label>; }
function Textarea({ label, value, onChange, placeholder }) { return <label className="field"><span>{label}</span><textarea value={value || ''} placeholder={placeholder || ''} onChange={e => onChange(e.target.value)} /></label>; }

function SiteDetail({ site, visits, onBack, onEdit, onDelete, onAddVisit }) {
  const [showVisit, setShowVisit] = useState(false);
  return <section>
    <button className="textButton" onClick={onBack}><ArrowLeft size={16}/> Back to Sites</button>
    <div className="detailHero"><div><p className="eyebrow">Customer Site</p><h2>{site.name}</h2><p>{site.address || 'No address saved'}</p></div><MapPin/></div>
    <div className="buttonRow"><button className="primary" onClick={() => setShowVisit(!showVisit)}><CalendarClock size={18}/> Add Visit</button><button onClick={onEdit}>Edit</button><button className="danger" onClick={() => confirm('Delete this site and its visits?') && onDelete()}><Trash2 size={18}/> Delete</button></div>
    {showVisit && <VisitForm siteId={site.id} onAdd={(v) => {onAddVisit(v); setShowVisit(false)}} />}
    <InfoBlock title="Panel" lines={[site.panelMaker, site.panelModel, site.communicator].filter(Boolean)} empty="No panel information saved." />
    <InfoBlock title="Access" lines={[site.access]} empty="No access instructions saved." />
    <InfoBlock title="Contacts" lines={[site.contacts]} empty="No contacts saved." />
    <InfoBlock title="Permanent Notes" lines={[site.notes]} empty="No permanent notes saved." />
    <h3>Visit History</h3>
    {visits.length === 0 ? <Empty text="No visits recorded yet." /> : visits.map(v => <div className="visit" key={v.id}><strong>{formatDateTime(v.startedAt)}</strong><p>{v.summary}</p><small>{v.workPerformed}</small></div>)}
  </section>;
}

function InfoBlock({ title, lines, empty }) { return <div className="infoBlock"><h3>{title}</h3>{lines?.filter(Boolean).length ? lines.filter(Boolean).map((l,i) => <p key={i}>{l}</p>) : <p className="muted">{empty}</p>}</div>; }

function VisitForm({ siteId, onAdd }) {
  const [form, setForm] = useState({ id: crypto.randomUUID(), siteId, startedAt: nowLocalInput(), endedAt: '', summary: '', workPerformed: '', followUp: '' });
  function update(field, value) { setForm(prev => ({ ...prev, [field]: value })); }
  return <div className="visitForm">
    <h3>New Visit</h3>
    <div className="grid2"><Input label="Arrival" value={form.startedAt} onChange={v => update('startedAt', v)} /><Input label="Departure" value={form.endedAt} onChange={v => update('endedAt', v)} /></div>
    <Textarea label="Short Summary" value={form.summary} onChange={v => update('summary', v)} placeholder="Ground fault on NAC 2, batteries replaced, panel reset..." />
    <Textarea label="Work Performed / Findings" value={form.workPerformed} onChange={v => update('workPerformed', v)} />
    <Textarea label="Follow-up Needed" value={form.followUp} onChange={v => update('followUp', v)} />
    <button className="primary full" onClick={() => form.summary.trim() ? onAdd({ ...form, startedAt: new Date(form.startedAt).toISOString(), endedAt: form.endedAt ? new Date(form.endedAt).toISOString() : '' }) : alert('Visit summary is required.')}><Save size={18}/> Save Visit</button>
  </div>;
}

function Resources({ data, setData }) {
  const [maker, setMaker] = useState(''); const [title, setTitle] = useState(''); const [url, setUrl] = useState(''); const [note, setNote] = useState('');
  function addResource() {
    if (!maker.trim() || !title.trim()) return alert('Manufacturer and title are required.');
    setData(prev => ({ ...prev, resources: [{ id: crypto.randomUUID(), maker, title, url, note }, ...prev.resources] }));
    setMaker(''); setTitle(''); setUrl(''); setNote('');
  }
  return <section><h2>Resource Library</h2><p className="muted">Store your own notes and links to official manufacturer resources.</p>
    <div className="visitForm"><div className="grid2"><Input label="Manufacturer" value={maker} onChange={setMaker}/><Input label="Title" value={title} onChange={setTitle}/></div><Input label="URL" value={url} onChange={setUrl}/><Textarea label="Note" value={note} onChange={setNote}/><button className="primary full" onClick={addResource}><Plus size={18}/> Add Resource</button></div>
    {data.resources.map(r => <div className="resource" key={r.id}><strong>{r.maker}</strong><h3>{r.title}</h3>{r.url && <a href={r.url} target="_blank">Open resource</a>}<p>{r.note}</p></div>)}
  </section>;
}

function Settings({ exportBackup, importBackup }) {
  return <section><h2>Settings</h2><div className="infoBlock"><h3>Backup</h3><p>FireVault V1 stores data locally in this browser. Export backups regularly before using real job information.</p><div className="buttonRow"><button className="primary" onClick={exportBackup}><Download size={18}/> Export Backup</button><label className="uploadButton"><Upload size={18}/> Import Backup<input type="file" accept="application/json" onChange={e => importBackup(e.target.files[0])}/></label></div></div><div className="infoBlock"><h3>Coming Later</h3><p>GPS site detection, photos, cloud sync, login, shared technician mode, AI search, and time-card summaries.</p></div></section>;
}

createRoot(document.getElementById('root')).render(<App />);
