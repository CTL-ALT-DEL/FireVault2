import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Flame,
  MapPin,
  Plus,
  Save,
  Search,
  Shield,
  Trash2,
  Upload,
  Wrench
} from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'firevault2:data:v2';
const OLD_STORAGE_KEY = 'firevault2:data:v1';

const starterResources = [
  { id: crypto.randomUUID(), maker: 'Fire-Lite', title: 'Panel manuals and programming notes', url: '', notes: 'Add official manual links and your own ES-series field notes here.' },
  { id: crypto.randomUUID(), maker: 'Silent Knight', title: 'Common programming notes', url: '', notes: 'Keep quick notes for common SK panels, troubles, and reset/walk-test steps.' },
  { id: crypto.randomUUID(), maker: 'Notifier', title: 'Troubleshooting references', url: '', notes: 'Store official links and your own field cheat sheets.' },
  { id: crypto.randomUUID(), maker: 'Potter', title: 'Panel setup notes', url: '', notes: 'Add manufacturer links, panel quirks, and common service reminders.' }
];

const blankData = {
  customers: [],
  visits: [],
  resources: starterResources,
  settings: { gpsRadiusFeet: 500 }
};

function normalizeData(data) {
  if (!data) return blankData;
  if (Array.isArray(data.customers)) {
    return {
      customers: data.customers,
      visits: Array.isArray(data.visits) ? data.visits : [],
      resources: Array.isArray(data.resources) ? data.resources : starterResources,
      settings: data.settings || blankData.settings
    };
  }

  // Backward compatibility with the first starter build, which used "sites".
  if (Array.isArray(data.sites)) {
    return {
      customers: data.sites.map(site => ({
        ...site,
        customerName: site.customerName || site.name || '',
        siteName: site.siteName || '',
        knownIssues: site.knownIssues || '',
        equipment: site.equipment || ''
      })),
      visits: Array.isArray(data.visits) ? data.visits : [],
      resources: Array.isArray(data.resources) ? data.resources : starterResources,
      settings: data.settings || blankData.settings
    };
  }

  return blankData;
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY);
    return raw ? normalizeData(JSON.parse(raw)) : blankData;
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

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function customerLabel(customer) {
  return customer.siteName ? `${customer.customerName} — ${customer.siteName}` : customer.customerName;
}

function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState('today');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => saveData(data), [data]);
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  const selectedCustomer = data.customers.find(c => c.id === selectedCustomerId) || null;

  function upsertCustomer(customer) {
    setData(prev => {
      const exists = prev.customers.some(c => c.id === customer.id);
      const nextCustomer = { ...customer, updatedAt: new Date().toISOString() };
      return {
        ...prev,
        customers: exists
          ? prev.customers.map(c => c.id === customer.id ? nextCustomer : c)
          : [nextCustomer, ...prev.customers]
      };
    });
    setSelectedCustomerId(customer.id);
    setTab('customer');
  }

  function deleteCustomer(customerId) {
    setData(prev => ({
      ...prev,
      customers: prev.customers.filter(c => c.id !== customerId),
      visits: prev.visits.filter(v => v.customerId !== customerId)
    }));
    setSelectedCustomerId(null);
    setTab('customers');
  }

  function addVisit(visit) {
    setData(prev => ({ ...prev, visits: [visit, ...prev.visits] }));
  }

  function updateSettings(nextSettings) {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...nextSettings } }));
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
        const next = normalizeData(JSON.parse(reader.result));
        if (!Array.isArray(next.customers) || !Array.isArray(next.visits)) throw new Error('Invalid backup');
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
      <div className="brandline">
        <div>
          <div className="brand"><Shield size={23}/> FireVault</div>
          <div className="subtitle">Customer memory for fire alarm service work</div>
        </div>
        <div className="build-badge">Build 0.2</div>
      </div>
    </header>

    <main className="content">
      {tab === 'today' && <Today data={data} setTab={setTab} setSelectedCustomerId={setSelectedCustomerId} />}
      {tab === 'customers' && <Customers data={data} query={query} setQuery={setQuery} setTab={setTab} setSelectedCustomerId={setSelectedCustomerId} />}
      {tab === 'add' && <CustomerForm onSave={upsertCustomer} />}
      {tab === 'customer' && selectedCustomer && <CustomerDetail customer={selectedCustomer} visits={data.visits.filter(v => v.customerId === selectedCustomer.id)} onSave={upsertCustomer} onDelete={deleteCustomer} addVisit={addVisit} />}
      {tab === 'resources' && <Resources resources={data.resources} setData={setData} />}
      {tab === 'settings' && <Settings settings={data.settings} updateSettings={updateSettings} exportJson={exportJson} importJson={importJson} />}
    </main>

    <nav className="nav">
      <button className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}><Clock/>Today</button>
      <button className={tab === 'customers' || tab === 'customer' ? 'active' : ''} onClick={() => setTab('customers')}><Building2/>Customers</button>
      <button className="add" onClick={() => setTab('add')}><Plus/>Add</button>
      <button className={tab === 'resources' ? 'active' : ''} onClick={() => setTab('resources')}><BookOpen/>Library</button>
      <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}><FileText/>Data</button>
    </nav>
  </div>;
}

function Today({ data, setTab, setSelectedCustomerId }) {
  const todayVisits = data.visits.filter(v => v.date === todayKey());
  const recentCustomers = [...data.customers]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 5);

  return <section>
    <h1>Today</h1>
    <div className="card hero">
      <div className="hero-icon"><Flame/></div>
      <h2>What do I already know about this customer?</h2>
      <p>FireVault is your site memory. Search the customer name, open the record, and add what you learn today.</p>
      <div className="hero-actions">
        <button className="primary" onClick={() => setTab('customers')}><Search/> Find Customer</button>
        <button onClick={() => setTab('add')}><Plus/> New Customer</button>
      </div>
    </div>

    <div className="stats-grid">
      <div className="stat"><strong>{data.customers.length}</strong><span>Customers</span></div>
      <div className="stat"><strong>{data.visits.length}</strong><span>Total Visits</span></div>
      <div className="stat"><strong>{todayVisits.length}</strong><span>Today</span></div>
    </div>

    <h2>Recent Customers</h2>
    {recentCustomers.length === 0 ? <Empty text="No customers yet. Tap New Customer to create the first site record." /> : recentCustomers.map(customer => <CustomerRow key={customer.id} customer={customer} onOpen={() => { setSelectedCustomerId(customer.id); setTab('customer'); }} />)}

    <h2>Today's Visits</h2>
    {todayVisits.length === 0 ? <Empty text="No visits logged today." /> : todayVisits.map(v => {
      const customer = data.customers.find(c => c.id === v.customerId);
      return <div className="card row" key={v.id} onClick={() => { setSelectedCustomerId(v.customerId); setTab('customer'); }}>
        <div><strong>{customer ? customerLabel(customer) : 'Unknown customer'}</strong><div className="muted">{formatTime(v.arrivedAt)} · {v.problem || v.summary || 'Service visit'}</div></div>
        <MapPin size={20}/>
      </div>;
    })}
  </section>;
}

function Customers({ data, query, setQuery, setTab, setSelectedCustomerId }) {
  const customers = useMemo(() => {
    const q = query.toLowerCase().trim();
    return data.customers
      .filter(c => [c.customerName, c.siteName, c.address, c.panelMake, c.panelModel, c.knownIssues, c.notes].join(' ').toLowerCase().includes(q))
      .sort((a, b) => a.customerName.localeCompare(b.customerName));
  }, [data.customers, query]);

  return <section>
    <h1>Customers</h1>
    <label className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customer, address, panel, problem..." /></label>
    {customers.length === 0 ? <Empty text="No matching customers. Tap Add to create a customer record." /> : customers.map(customer => <CustomerRow key={customer.id} customer={customer} onOpen={() => { setSelectedCustomerId(customer.id); setTab('customer'); }} />)}
  </section>;
}

function CustomerRow({ customer, onOpen }) {
  return <div className="card customer-card" onClick={onOpen}>
    <div className="customer-topline">
      <strong>{customer.customerName || 'Unnamed customer'}</strong>
      {customer.knownIssues ? <span className="issue-dot"><AlertTriangle size={14}/> Issues</span> : null}
    </div>
    <div className="muted">{customer.siteName || customer.address || 'Site details needed'}</div>
    <div className="pill-row">
      <span className="pill">{[customer.panelMake, customer.panelModel].filter(Boolean).join(' ') || 'Panel info needed'}</span>
      {customer.facpLocation ? <span className="pill neutral">FACP: {customer.facpLocation}</span> : null}
    </div>
  </div>;
}

function CustomerForm({ onSave, existing }) {
  const [customer, setCustomer] = useState(existing || {
    id: crypto.randomUUID(),
    customerName: '',
    siteName: '',
    address: '',
    latitude: '',
    longitude: '',
    panelMake: '',
    panelModel: '',
    equipment: '',
    facpLocation: '',
    annunciatorLocation: '',
    contacts: '',
    accessNotes: '',
    monitoringInfo: '',
    accountNumber: '',
    knownIssues: '',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  function set(k, v) { setCustomer(prev => ({ ...prev, [k]: v, updatedAt: new Date().toISOString() })); }

  function getGps() {
    if (!navigator.geolocation) return alert('Geolocation is not available on this device/browser.');
    navigator.geolocation.getCurrentPosition(pos => {
      setCustomer(prev => ({
        ...prev,
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
        updatedAt: new Date().toISOString()
      }));
    }, () => alert('Location permission was denied or unavailable.'));
  }

  return <section>
    <h1>{existing ? 'Edit Customer' : 'New Customer'}</h1>
    <div className="card form">
      <div className="form-section-title">Customer Identity</div>
      <input value={customer.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Customer name *" />
      <input value={customer.siteName} onChange={e => set('siteName', e.target.value)} placeholder="Site / building name" />
      <input value={customer.address} onChange={e => set('address', e.target.value)} placeholder="Address" />
      <input value={customer.accountNumber} onChange={e => set('accountNumber', e.target.value)} placeholder="Account / monitoring number" />

      <div className="form-section-title">Fire Alarm System</div>
      <div className="grid2"><input value={customer.panelMake} onChange={e => set('panelMake', e.target.value)} placeholder="Panel manufacturer" /><input value={customer.panelModel} onChange={e => set('panelModel', e.target.value)} placeholder="Panel model" /></div>
      <textarea value={customer.equipment} onChange={e => set('equipment', e.target.value)} placeholder="Equipment inventory: FACP, NAC supplies, annunciators, dialer/radio, duct detectors, elevator recall, sprinkler points..." />
      <input value={customer.facpLocation} onChange={e => set('facpLocation', e.target.value)} placeholder="FACP location" />
      <input value={customer.annunciatorLocation} onChange={e => set('annunciatorLocation', e.target.value)} placeholder="Annunciator location" />

      <div className="form-section-title">Field Notes</div>
      <textarea value={customer.accessNotes} onChange={e => set('accessNotes', e.target.value)} placeholder="Access notes / keybox / gate / where to park" />
      <textarea value={customer.contacts} onChange={e => set('contacts', e.target.value)} placeholder="Contacts" />
      <textarea value={customer.monitoringInfo} onChange={e => set('monitoringInfo', e.target.value)} placeholder="Monitoring company / central station notes" />
      <textarea value={customer.knownIssues} onChange={e => set('knownIssues', e.target.value)} placeholder="Known issues: recurring ground fault, bad device, trouble history..." />
      <textarea value={customer.notes} onChange={e => set('notes', e.target.value)} placeholder="Permanent customer notes" />

      <div className="form-section-title">GPS Anchor</div>
      <div className="grid2"><input value={customer.latitude} onChange={e => set('latitude', e.target.value)} placeholder="Latitude" /><input value={customer.longitude} onChange={e => set('longitude', e.target.value)} placeholder="Longitude" /></div>
      <button className="secondary" onClick={getGps}><MapPin/> Use current GPS</button>
      <button className="primary" disabled={!customer.customerName.trim()} onClick={() => onSave(customer)}><Save/> Save Customer</button>
    </div>
  </section>;
}

function CustomerDetail({ customer, visits, onSave, onDelete, addVisit }) {
  const [editing, setEditing] = useState(false);
  const [visit, setVisit] = useState({ problem: '', cause: '', repair: '', recommendation: '', notes: '' });
  const latestVisit = visits[0];

  if (editing) return <CustomerForm existing={customer} onSave={(c) => { onSave(c); setEditing(false); }} />;

  function setVisitField(k, v) { setVisit(prev => ({ ...prev, [k]: v })); }

  function logVisit() {
    const now = new Date().toISOString();
    addVisit({
      id: crypto.randomUUID(),
      customerId: customer.id,
      date: todayKey(),
      arrivedAt: now,
      leftAt: '',
      ...visit,
      createdAt: now
    });
    setVisit({ problem: '', cause: '', repair: '', recommendation: '', notes: '' });
  }

  return <section>
    <div className="detail-header">
      <div>
        <h1>{customer.customerName}</h1>
        <div className="muted">{customer.siteName || customer.address || 'Site details needed'}</div>
      </div>
      <button onClick={() => setEditing(true)}>Edit</button>
    </div>

    <div className="card intelligence-card">
      <div className="section-kicker"><Shield size={16}/> Before you go inside</div>
      <div className="intel-grid">
        <InfoTile label="Panel" value={[customer.panelMake, customer.panelModel].filter(Boolean).join(' ') || 'Panel info needed'} icon={<Wrench/>} />
        <InfoTile label="Last Visit" value={latestVisit ? formatDateTime(latestVisit.createdAt) : 'No visits yet'} icon={<CalendarClock/>} />
        <InfoTile label="FACP" value={customer.facpLocation || 'Unknown'} icon={<MapPin/>} />
      </div>
      {customer.knownIssues ? <div className="warning-box"><AlertTriangle/> <span>{customer.knownIssues}</span></div> : <div className="ok-box"><CheckCircle2/> No known issues saved yet.</div>}
    </div>

    <div className="card">
      <h2>Customer File</h2>
      <p><strong>Address:</strong> {customer.address || '—'}</p>
      <p><strong>Account:</strong> {customer.accountNumber || '—'}</p>
      <p><strong>Annunciator:</strong> {customer.annunciatorLocation || '—'}</p>
      <p><strong>Access:</strong> {customer.accessNotes || '—'}</p>
      <p><strong>Contacts:</strong> {customer.contacts || '—'}</p>
      <p><strong>Monitoring:</strong> {customer.monitoringInfo || '—'}</p>
      <p><strong>Equipment:</strong><br />{customer.equipment || '—'}</p>
      <p><strong>Permanent notes:</strong><br />{customer.notes || '—'}</p>
      <div className="actions"><button className="danger" onClick={() => confirm('Delete this customer and all visit history?') && onDelete(customer.id)}><Trash2/>Delete</button></div>
    </div>

    <h2>Log Service Visit</h2>
    <div className="card form">
      <input value={visit.problem} onChange={e => setVisitField('problem', e.target.value)} placeholder="Problem / ticket reason" />
      <textarea value={visit.cause} onChange={e => setVisitField('cause', e.target.value)} placeholder="Cause found" />
      <textarea value={visit.repair} onChange={e => setVisitField('repair', e.target.value)} placeholder="Repair / work performed" />
      <textarea value={visit.recommendation} onChange={e => setVisitField('recommendation', e.target.value)} placeholder="Recommendation / follow-up" />
      <textarea value={visit.notes} onChange={e => setVisitField('notes', e.target.value)} placeholder="Extra visit notes" />
      <button className="primary" onClick={logVisit}><Save/> Save Visit Note</button>
    </div>

    <h2>Visit Timeline</h2>
    {visits.length === 0 ? <Empty text="No visits saved for this customer yet." /> : visits.map(v => <div className="card timeline-card" key={v.id}>
      <div className="timeline-top"><strong>{v.date}</strong><span>{formatTime(v.arrivedAt)}</span></div>
      {v.problem && <p><strong>Problem:</strong> {v.problem}</p>}
      {v.cause && <p><strong>Cause:</strong> {v.cause}</p>}
      {v.repair && <p><strong>Repair:</strong> {v.repair}</p>}
      {v.recommendation && <p><strong>Follow-up:</strong> {v.recommendation}</p>}
      {v.notes && <p className="notes">{v.notes}</p>}
    </div>)}
  </section>;
}

function InfoTile({ label, value, icon }) {
  return <div className="info-tile"><div className="info-icon">{icon}</div><span>{label}</span><strong>{value}</strong></div>;
}

function Resources({ resources, setData }) {
  const [draft, setDraft] = useState({ maker: '', title: '', url: '', notes: '' });
  function add() {
    if (!draft.maker || !draft.title) return;
    setData(prev => ({ ...prev, resources: [{ ...draft, id: crypto.randomUUID() }, ...prev.resources] }));
    setDraft({ maker: '', title: '', url: '', notes: '' });
  }
  function remove(id) {
    setData(prev => ({ ...prev, resources: prev.resources.filter(r => r.id !== id) }));
  }
  return <section><h1>Resource Library</h1>
    <div className="card form"><div className="grid2"><input placeholder="Manufacturer" value={draft.maker} onChange={e => setDraft({...draft, maker:e.target.value})}/><input placeholder="Title" value={draft.title} onChange={e => setDraft({...draft, title:e.target.value})}/></div><input placeholder="Official link" value={draft.url} onChange={e => setDraft({...draft, url:e.target.value})}/><textarea placeholder="Your cheat sheet notes" value={draft.notes} onChange={e => setDraft({...draft, notes:e.target.value})}/><button className="primary" onClick={add}>Add Resource</button></div>
    {resources.map(r => <div className="card" key={r.id}><div className="customer-topline"><strong>{r.maker}: {r.title}</strong><button className="mini danger" onClick={() => remove(r.id)}><Trash2/></button></div>{r.url && <p><a href={r.url} target="_blank" rel="noreferrer">Open link</a></p>}<p>{r.notes}</p></div>)}
  </section>;
}

function Settings({ settings, updateSettings, exportJson, importJson }) {
  return <section><h1>Data & Settings</h1>
    <div className="card form">
      <div className="form-section-title">GPS Matching</div>
      <label className="field-label">Arrival radius in feet</label>
      <input value={settings.gpsRadiusFeet} onChange={e => updateSettings({ gpsRadiusFeet: e.target.value })} placeholder="500" />
      <p className="muted">Background GPS will come later. This setting prepares the customer matching logic.</p>
    </div>
    <div className="card"><p>Build 0.2 stores data locally in this browser. Export backups often until cloud sync is added.</p><div className="actions"><button className="primary" onClick={exportJson}><Download/> Export Backup</button><label className="upload"><Upload/> Import Backup<input type="file" accept="application/json" onChange={e => e.target.files[0] && importJson(e.target.files[0])}/></label></div></div>
  </section>;
}

function Empty({ text }) { return <div className="empty">{text}</div>; }

createRoot(document.getElementById('root')).render(<App />);
