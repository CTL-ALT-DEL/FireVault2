import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapPin, Building2, Plus, Search, Clock, FileText, Download, Upload, Trash2, Save, Shield, BookOpen } from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'firevault2:data:v1';

const blankData = {
  sites: [],
  visits: [],
  resources: [
    { id: crypto.randomUUID(), maker: 'Fire-Lite', title: 'Panel manual link', url: '', notes: 'Add official manual links and your own field notes here.' },
    { id: crypto.randomUUID(), maker: 'Silent Knight', title: 'Programming notes', url: '', notes: 'Keep short cheat sheets and common trouble notes.' },
    { id: crypto.randomUUID(), maker: 'Notifier', title: 'Common panel notes', url: '', notes: 'Use links to official resources where possible.' }
  ]
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : blankData;
  } catch {
    return blankData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function formatTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState('today');
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => saveData(data), [data]);
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  const selectedSite = data.sites.find(s => s.id === selectedSiteId) || null;

  function upsertSite(site) {
    setData(prev => {
      const exists = prev.sites.some(s => s.id === site.id);
      return { ...prev, sites: exists ? prev.sites.map(s => s.id === site.id ? site : s) : [site, ...prev.sites] };
    });
    setSelectedSiteId(site.id);
    setTab('site');
  }

  function deleteSite(siteId) {
    setData(prev => ({
      ...prev,
      sites: prev.sites.filter(s => s.id !== siteId),
      visits: prev.visits.filter(v => v.siteId !== siteId)
    }));
    setSelectedSiteId(null);
    setTab('sites');
  }

  function addVisit(visit) {
    setData(prev => ({ ...prev, visits: [visit, ...prev.visits] }));
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firevault-backup-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = JSON.parse(reader.result);
        if (!Array.isArray(next.sites) || !Array.isArray(next.visits)) throw new Error('Invalid backup');
        setData(next);
        alert('Backup imported.');
      } catch {
        alert('That file does not look like a FireVault backup.');
      }
    };
    reader.readAsText(file);
  }

  return <div className="app">
    <header className="topbar">
      <div>
        <div className="brand"><Shield size={22}/> FireVault</div>
        <div className="subtitle">Customer site memory for fire alarm technicians</div>
      </div>
    </header>

    <main className="content">
      {tab === 'today' && <Today data={data} setTab={setTab} setSelectedSiteId={setSelectedSiteId} addVisit={addVisit} />}
      {tab === 'sites' && <Sites data={data} query={query} setQuery={setQuery} setTab={setTab} setSelectedSiteId={setSelectedSiteId} />}
      {tab === 'add' && <SiteForm onSave={upsertSite} />}
      {tab === 'site' && selectedSite && <SiteDetail site={selectedSite} visits={data.visits.filter(v => v.siteId === selectedSite.id)} onSave={upsertSite} onDelete={deleteSite} addVisit={addVisit} />}
      {tab === 'resources' && <Resources resources={data.resources} setData={setData} />}
      {tab === 'settings' && <Settings exportJson={exportJson} importJson={importJson} />}
    </main>

    <nav className="nav">
      <button className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}><Clock/>Today</button>
      <button className={tab === 'sites' || tab === 'site' ? 'active' : ''} onClick={() => setTab('sites')}><Building2/>Sites</button>
      <button className="add" onClick={() => setTab('add')}><Plus/>Add</button>
      <button className={tab === 'resources' ? 'active' : ''} onClick={() => setTab('resources')}><BookOpen/>Library</button>
      <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}><FileText/>Data</button>
    </nav>
  </div>;
}

function Today({ data, setTab, setSelectedSiteId, addVisit }) {
  const todayVisits = data.visits.filter(v => v.date === todayKey());
  return <section>
    <h1>Today</h1>
    <div className="card hero">
      <h2>{todayVisits.length} visit{todayVisits.length === 1 ? '' : 's'} logged today</h2>
      <p>Start by adding a site, then log arrivals, departures, notes, and panel details.</p>
    </div>
    <h2>Today's visits</h2>
    {todayVisits.length === 0 ? <Empty text="No visits logged today." /> : todayVisits.map(v => {
      const site = data.sites.find(s => s.id === v.siteId);
      return <div className="card row" key={v.id} onClick={() => { setSelectedSiteId(v.siteId); setTab('site'); }}>
        <div><strong>{site?.name || 'Unknown site'}</strong><div className="muted">{formatTime(v.arrivedAt)} – {formatTime(v.leftAt)}</div></div>
        <MapPin size={20}/>
      </div>;
    })}
  </section>;
}

function Sites({ data, query, setQuery, setTab, setSelectedSiteId }) {
  const sites = data.sites.filter(s => [s.name, s.address, s.panelMake, s.panelModel].join(' ').toLowerCase().includes(query.toLowerCase()));
  return <section>
    <h1>Sites</h1>
    <label className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customer, address, panel..." /></label>
    {sites.length === 0 ? <Empty text="No sites yet. Tap Add to create your first customer site." /> : sites.map(site => <div className="card site-card" key={site.id} onClick={() => { setSelectedSiteId(site.id); setTab('site'); }}>
      <strong>{site.name}</strong>
      <div className="muted">{site.address || 'No address saved'}</div>
      <div className="pill">{[site.panelMake, site.panelModel].filter(Boolean).join(' ') || 'Panel info needed'}</div>
    </div>)}
  </section>;
}

function SiteForm({ onSave, existing }) {
  const [site, setSite] = useState(existing || {
    id: crypto.randomUUID(), name: '', address: '', latitude: '', longitude: '', panelMake: '', panelModel: '', facpLocation: '', annunciatorLocation: '', contacts: '', accessNotes: '', monitoringInfo: '', notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  });
  function set(k, v) { setSite(prev => ({ ...prev, [k]: v, updatedAt: new Date().toISOString() })); }
  function getGps() {
    navigator.geolocation?.getCurrentPosition(pos => {
      set('latitude', pos.coords.latitude.toFixed(6));
      set('longitude', pos.coords.longitude.toFixed(6));
    }, () => alert('Location permission was denied or unavailable.'));
  }
  return <section>
    <h1>{existing ? 'Edit Site' : 'Add Site'}</h1>
    <div className="card form">
      <input value={site.name} onChange={e => set('name', e.target.value)} placeholder="Customer / site name" />
      <input value={site.address} onChange={e => set('address', e.target.value)} placeholder="Address" />
      <div className="grid2"><input value={site.panelMake} onChange={e => set('panelMake', e.target.value)} placeholder="Panel make" /><input value={site.panelModel} onChange={e => set('panelModel', e.target.value)} placeholder="Panel model" /></div>
      <input value={site.facpLocation} onChange={e => set('facpLocation', e.target.value)} placeholder="FACP location" />
      <input value={site.annunciatorLocation} onChange={e => set('annunciatorLocation', e.target.value)} placeholder="Annunciator location" />
      <textarea value={site.accessNotes} onChange={e => set('accessNotes', e.target.value)} placeholder="Access notes / gate / keybox / where to park" />
      <textarea value={site.contacts} onChange={e => set('contacts', e.target.value)} placeholder="Contacts" />
      <textarea value={site.monitoringInfo} onChange={e => set('monitoringInfo', e.target.value)} placeholder="Monitoring account info" />
      <textarea value={site.notes} onChange={e => set('notes', e.target.value)} placeholder="Permanent site notes" />
      <div className="grid2"><input value={site.latitude} onChange={e => set('latitude', e.target.value)} placeholder="Latitude" /><input value={site.longitude} onChange={e => set('longitude', e.target.value)} placeholder="Longitude" /></div>
      <button className="secondary" onClick={getGps}><MapPin/> Use current GPS</button>
      <button className="primary" disabled={!site.name.trim()} onClick={() => onSave(site)}><Save/> Save Site</button>
    </div>
  </section>;
}

function SiteDetail({ site, visits, onSave, onDelete, addVisit }) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState('');
  const [summary, setSummary] = useState('');
  if (editing) return <SiteForm existing={site} onSave={(s) => { onSave(s); setEditing(false); }} />;
  function logVisit() {
    const now = new Date().toISOString();
    addVisit({ id: crypto.randomUUID(), siteId: site.id, date: todayKey(), arrivedAt: now, leftAt: '', summary, note, createdAt: now });
    setNote(''); setSummary('');
  }
  return <section>
    <h1>{site.name}</h1>
    <div className="card">
      <div className="muted">{site.address}</div>
      <div className="pill">{[site.panelMake, site.panelModel].filter(Boolean).join(' ') || 'Panel info needed'}</div>
      <p><strong>FACP:</strong> {site.facpLocation || '—'}</p>
      <p><strong>Annunciator:</strong> {site.annunciatorLocation || '—'}</p>
      <p><strong>Access:</strong> {site.accessNotes || '—'}</p>
      <p><strong>Contacts:</strong> {site.contacts || '—'}</p>
      <p><strong>Monitoring:</strong> {site.monitoringInfo || '—'}</p>
      <p><strong>Site notes:</strong><br />{site.notes || '—'}</p>
      <div className="actions"><button onClick={() => setEditing(true)}>Edit</button><button className="danger" onClick={() => confirm('Delete this site and its visits?') && onDelete(site.id)}><Trash2/>Delete</button></div>
    </div>

    <h2>Log a visit</h2>
    <div className="card form">
      <input value={summary} onChange={e => setSummary(e.target.value)} placeholder="Short summary: NAC trouble, annual inspection, batteries..." />
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Visit notes" />
      <button className="primary" onClick={logVisit}>Log arrival / visit note</button>
    </div>

    <h2>Visit history</h2>
    {visits.length === 0 ? <Empty text="No visits saved for this site yet." /> : visits.map(v => <div className="card" key={v.id}>
      <strong>{v.date}</strong> <span className="muted">{formatTime(v.arrivedAt)}</span>
      <p>{v.summary || 'Service visit'}</p>
      <p className="notes">{v.note}</p>
    </div>)}
  </section>;
}

function Resources({ resources, setData }) {
  const [draft, setDraft] = useState({ maker: '', title: '', url: '', notes: '' });
  function add() {
    if (!draft.maker || !draft.title) return;
    setData(prev => ({ ...prev, resources: [{ ...draft, id: crypto.randomUUID() }, ...prev.resources] }));
    setDraft({ maker: '', title: '', url: '', notes: '' });
  }
  return <section><h1>Resource Library</h1>
    <div className="card form"><div className="grid2"><input placeholder="Manufacturer" value={draft.maker} onChange={e => setDraft({...draft, maker:e.target.value})}/><input placeholder="Title" value={draft.title} onChange={e => setDraft({...draft, title:e.target.value})}/></div><input placeholder="Official link" value={draft.url} onChange={e => setDraft({...draft, url:e.target.value})}/><textarea placeholder="Your cheat sheet notes" value={draft.notes} onChange={e => setDraft({...draft, notes:e.target.value})}/><button className="primary" onClick={add}>Add Resource</button></div>
    {resources.map(r => <div className="card" key={r.id}><strong>{r.maker}: {r.title}</strong>{r.url && <p><a href={r.url} target="_blank">Open link</a></p>}<p>{r.notes}</p></div>)}
  </section>;
}

function Settings({ exportJson, importJson }) {
  return <section><h1>Data</h1><div className="card"><p>Version 1 stores data locally in this browser. Export backups often until cloud sync is added.</p><button className="primary" onClick={exportJson}><Download/> Export Backup</button><label className="upload"><Upload/> Import Backup<input type="file" accept="application/json" onChange={e => e.target.files[0] && importJson(e.target.files[0])}/></label></div></section>;
}

function Empty({ text }) { return <div className="empty">{text}</div>; }

createRoot(document.getElementById('root')).render(<App />);
