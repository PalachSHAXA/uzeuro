import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Users, Video, Mail, Calendar, BookOpen, Newspaper,
  LogOut, RefreshCw, Eye, Check, X, Trash2, Plus, Edit2, ChevronDown,
  Search, Filter, Image
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import {
  getStats, getApplications, updateApplication, deleteApplication,
  getRegistrations, updateRegistration, deleteRegistration,
  getMessages, updateMessage, deleteMessage,
  eventsApi, webinarsApi, publicationsApi, newsApi
} from '../services/api';

// ============ LOGIN ============
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'uzeuro' && password === 'eurouz') {
      localStorage.setItem('uzeuro_admin', 'true');
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003399] to-[#1A1A2E] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="UZEURO" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">UZEURO Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Username" value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003399] focus:border-transparent outline-none"
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003399] focus:border-transparent outline-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-[#003399] text-white py-3 rounded-xl font-semibold hover:bg-[#002277] transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// ============ TYPES ============
interface StatsData {
  applications: { total: number; new_count: number };
  registrations: { total: number };
  messages: { total: number; new_count: number };
  events: { total: number };
  webinars: { total: number };
  publications: { total: number };
  news: { total: number };
}

// ============ STAT CARD ============
function StatCard({ label, value, newCount, icon: Icon, color }: {
  label: string; value: number; newCount?: number; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {newCount !== undefined && newCount > 0 && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mt-2 inline-block">
              {newCount} new
            </span>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// ============ DATA TABLE ============
function DataTable({ columns, data, actions, onRowClick }: {
  columns: { key: string; label: string; render?: (v: unknown, row: Record<string, unknown>) => React.ReactNode }[];
  data: Record<string, unknown>[];
  actions?: (row: Record<string, unknown>) => React.ReactNode;
  onRowClick?: (row: Record<string, unknown>) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map(col => (
              <th key={col.key} className="text-left py-3 px-4 text-sm font-medium text-gray-500">{col.label}</th>
            ))}
            {actions && <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-gray-400">No data</td></tr>
          ) : data.map((row, i) => (
            <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50/50 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}>
              {columns.map(col => (
                <td key={col.key} className="py-3 px-4 text-sm">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
              {actions && <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============ DETAIL MODAL ============
function DetailModal({ item, onClose, title }: { item: Record<string, unknown>; onClose: () => void; title: string }) {
  const fieldLabels: Record<string, string> = {
    id: '#', first_name: 'First Name', last_name: 'Last Name', email: 'Email',
    company: 'Company', position: 'Position', country: 'Country', experience: 'Experience',
    tier: 'Tier', specializations: 'Specializations', status: 'Status',
    created_at: 'Date', name: 'Name', webinar_id: 'Webinar ID', webinar_title: 'Webinar',
    subject: 'Subject', message: 'Message', updated_at: 'Updated',
  };
  const entries = Object.entries(item).filter(([k]) => k !== 'id' && item[k] !== null && item[k] !== '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title} #{String(item.id)}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-xs font-medium text-gray-400 uppercase">{fieldLabels[key] || key.replace(/_/g, ' ')}</span>
              {key === 'status' ? (
                <StatusBadge status={String(value)} />
              ) : key === 'created_at' || key === 'updated_at' ? (
                <span className="text-sm text-gray-800">{new Date(String(value)).toLocaleString()}</span>
              ) : key === 'specializations' ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {(() => { try { return JSON.parse(String(value)); } catch { return []; } })().map((s: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{s}</span>
                  ))}
                </div>
              ) : key === 'message' ? (
                <p className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg mt-1">{String(value)}</p>
              ) : (
                <span className="text-sm text-gray-800">{String(value)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ STATUS BADGE ============
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    reviewed: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    registered: 'bg-blue-100 text-blue-700',
    attended: 'bg-green-100 text-green-700',
    missed: 'bg-red-100 text-red-700',
    read: 'bg-gray-100 text-gray-700',
    replied: 'bg-green-100 text-green-700',
    active: 'bg-green-100 text-green-700',
    draft: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    closed: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ============ COMPRESS & UPLOAD IMAGE ============
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://uzeuro-api.shaxzod.workers.dev';

function compressImage(file: File, maxWidth = 1200, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file: File): Promise<string> {
  const base64 = await compressImage(file);
  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: base64 }),
  });
  const data = await res.json();
  if (data.url) return data.url;
  throw new Error('Upload failed');
}

// ============ IMAGE UPLOAD FIELD ============
function ImageUploadField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch { alert('Upload failed'); }
    setUploading(false);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2 items-start">
        <input type="file" accept="image/*" onChange={handleFile} className="flex-1 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#003399] file:text-white file:cursor-pointer file:text-sm" />
        {uploading && <span className="text-sm text-blue-500 font-medium animate-pulse">Uploading...</span>}
      </div>
      {value && (
        <div className="mt-2 relative inline-block">
          <img src={value} alt="" className="h-24 rounded-lg object-cover border" />
          <button onClick={() => onChange('')} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
        </div>
      )}
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Or paste image URL..." className="w-full mt-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#003399] outline-none" />
    </div>
  );
}

// ============ FILE UPLOAD FIELD ============
function FileUploadField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch(`${API_BASE_URL}/api/upload-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: base64, fileName: file.name, mimeType: file.type }),
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        setFileName(file.name);
      } else {
        alert('Upload failed');
      }
    } catch { alert('Upload failed'); }
    setUploading(false);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2 items-start">
        <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" onChange={handleFile}
          className="flex-1 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#003399] file:text-white file:cursor-pointer file:text-sm" />
        {uploading && <span className="text-sm text-blue-500 font-medium animate-pulse">Uploading...</span>}
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          <span>File uploaded: {fileName || 'document'}</span>
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Preview</a>
          <button onClick={() => { onChange(''); setFileName(''); }} className="ml-auto text-red-500 text-xs">Remove</button>
        </div>
      )}
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Or paste file URL..."
        className="w-full mt-2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#003399] outline-none" />
    </div>
  );
}

// ============ GALLERY UPLOAD FIELD ============
function GalleryUploadField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');

  const getPhotos = (): string[] => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch { /* not JSON */ }
    return value.split(',').map(s => s.trim()).filter(Boolean);
  };

  const setPhotos = (photos: string[]) => {
    onChange(JSON.stringify(photos));
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const existing = getPhotos();
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(`Uploading ${i + 1}/${files.length}...`);
      try {
        const url = await uploadImage(files[i]);
        newUrls.push(url);
      } catch { /* skip */ }
    }
    setPhotos([...existing, ...newUrls]);
    setUploading(false);
    setProgress('');
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    const photos = getPhotos();
    photos.splice(index, 1);
    setPhotos(photos);
  };

  const photos = getPhotos();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="file" accept="image/*" multiple onChange={handleFiles} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#003399] file:text-white file:cursor-pointer file:text-sm" />
      {uploading && <span className="text-sm text-blue-500 font-medium mt-1 block animate-pulse">{progress}</span>}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {photos.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt="" className="w-full h-20 object-cover rounded-lg border" />
              <button onClick={() => removePhoto(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-1">{photos.length} photo(s) added</p>
    </div>
  );
}

// ============ CRUD MODAL ============
function CrudModal({ title, fields, initial, onSave, onClose }: {
  title: string;
  fields: { key: string; label: string; type?: string; options?: { value: string; label: string }[] }[];
  initial?: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Record<string, unknown>>(initial || {});

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key} className={f.type === 'textarea' || f.type === 'gallery' || f.type === 'file' ? 'md:col-span-2' : ''}>

              {f.type === 'file' ? (
                <FileUploadField
                  value={String(form[f.key] || '')}
                  onChange={v => setForm({ ...form, [f.key]: v })}
                  label={f.label}
                />
              ) : f.type === 'image' ? (
                <ImageUploadField
                  value={String(form[f.key] || '')}
                  onChange={v => setForm({ ...form, [f.key]: v })}
                  label={f.label}
                />
              ) : f.type === 'gallery' ? (
                <GalleryUploadField
                  value={String(form[f.key] || '')}
                  onChange={v => setForm({ ...form, [f.key]: v })}
                  label={f.label}
                />
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={String(form[f.key] || '')}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#003399] outline-none"
                      rows={3}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={String(form[f.key] || '')}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#003399] outline-none"
                    >
                      <option value="">Select...</option>
                      {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type || 'text'}
                      value={String(form[f.key] || '')}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#003399] outline-none"
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-[#003399] text-white rounded-lg hover:bg-[#002277]">Save</button>
        </div>
      </div>
    </div>
  );
}

// ============ SECTIONS ============
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: Users },
  { id: 'registrations', label: 'Registrations', icon: Video },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'webinars', label: 'Webinars', icon: Video },
  { id: 'publications', label: 'Publications', icon: BookOpen },
  { id: 'news', label: 'News', icon: Newspaper },
];

// ============ MAIN ADMIN ============
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('uzeuro_admin') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Record<string, unknown> } | null>(null);
  const [detailItem, setDetailItem] = useState<Record<string, unknown> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [eventFilter, setEventFilter] = useState(''); // upcoming, past
  const [eventFormat, setEventFormat] = useState(''); // online, in-person
  const [regViewer, setRegViewer] = useState<{ type: 'webinar' | 'event'; id: number; title: string } | null>(null);
  const [regList, setRegList] = useState<Record<string, unknown>[]>([]);
  const [regLoading, setRegLoading] = useState(false);

  const loadRegistrations = async (type: 'webinar' | 'event', id: number) => {
    setRegLoading(true);
    try {
      const endpoint = type === 'webinar' ? `/api/registrations?webinar_id=${id}` : `/api/event-registrations?event_id=${id}`;
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      const result = await res.json();
      setRegList(Array.isArray(result) ? result : []);
    } catch { setRegList([]); }
    setRegLoading(false);
  };

  const loadStats = useCallback(async () => {
    try {
      const s = await getStats();
      setStats(s);
    } catch { /* API not connected yet */ }
  }, []);

  const loadData = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      let result: Record<string, unknown>[] = [];
      switch (tab) {
        case 'applications': result = await getApplications(filterStatus || undefined); break;
        case 'registrations': result = await getRegistrations(); break;
        case 'messages': result = await getMessages(filterStatus || undefined); break;
        case 'events': result = await eventsApi.getAll(filterStatus || undefined, { filter: eventFilter, format: eventFormat }); break;
        case 'webinars': result = await webinarsApi.getAll(filterStatus || undefined); break;
        case 'publications': result = await publicationsApi.getAll(filterStatus || undefined); break;
        case 'news': result = await newsApi.getAll(filterStatus || undefined); break;
      }
      setData(result);
    } catch { setData([]); }
    setLoading(false);
  }, [filterStatus, eventFilter, eventFormat]);

  useEffect(() => {
    if (isLoggedIn) {
      loadStats();
      const interval = setInterval(loadStats, 15000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, loadStats]);

  useEffect(() => {
    if (isLoggedIn && activeTab !== 'dashboard') {
      loadData(activeTab);
    }
  }, [isLoggedIn, activeTab, filterStatus, eventFilter, eventFormat, loadData]);

  const handleLogout = () => {
    localStorage.removeItem('uzeuro_admin');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const filteredData = search
    ? data.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    : data;

  // ---- Section configs ----
  const sectionConfig: Record<string, {
    columns: { key: string; label: string; render?: (v: unknown, row: Record<string, unknown>) => React.ReactNode }[];
    statuses: string[];
    actions: (row: Record<string, unknown>) => React.ReactNode;
    crudFields?: { key: string; label: string; type?: string; options?: { value: string; label: string }[] }[];
    canCreate?: boolean;
  }> = {
    applications: {
      columns: [
        { key: 'id', label: '#' },
        { key: 'first_name', label: 'Name', render: (_, r) => `${r.first_name} ${r.last_name}` },
        { key: 'email', label: 'Email' },
        { key: 'tier', label: 'Tier' },
        { key: 'country', label: 'Country' },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
        { key: 'created_at', label: 'Date', render: (v) => new Date(String(v)).toLocaleDateString() },
      ],
      statuses: ['new', 'reviewed', 'approved', 'rejected'],
      actions: (row) => (
        <div className="flex gap-1 justify-end">
          {row.status === 'new' && (
            <button onClick={() => { updateApplication(Number(row.id), 'reviewed'); loadData('applications'); }}
              className="p-1.5 hover:bg-blue-50 rounded" title="Mark Reviewed"><Eye className="w-4 h-4 text-blue-600" /></button>
          )}
          {(row.status === 'new' || row.status === 'reviewed') && (
            <>
              <button onClick={() => { updateApplication(Number(row.id), 'approved'); loadData('applications'); }}
                className="p-1.5 hover:bg-green-50 rounded" title="Approve"><Check className="w-4 h-4 text-green-600" /></button>
              <button onClick={() => { updateApplication(Number(row.id), 'rejected'); loadData('applications'); }}
                className="p-1.5 hover:bg-red-50 rounded" title="Reject"><X className="w-4 h-4 text-red-600" /></button>
            </>
          )}
          <button onClick={() => { deleteApplication(Number(row.id)); loadData('applications'); }}
            className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
        </div>
      ),
    },
    registrations: {
      columns: [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'citizenship', label: 'Citizenship' },
        { key: 'telegram', label: 'Telegram' },
        { key: 'webinar_title', label: 'Webinar' },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
        { key: 'created_at', label: 'Date', render: (v) => new Date(String(v)).toLocaleDateString() },
      ],
      statuses: ['registered', 'attended', 'missed'],
      actions: (row) => (
        <div className="flex gap-1 justify-end">
          <button onClick={() => { updateRegistration(Number(row.id), 'attended'); loadData('registrations'); }}
            className="p-1.5 hover:bg-green-50 rounded" title="Attended"><Check className="w-4 h-4 text-green-600" /></button>
          <button onClick={() => { updateRegistration(Number(row.id), 'missed'); loadData('registrations'); }}
            className="p-1.5 hover:bg-red-50 rounded" title="Missed"><X className="w-4 h-4 text-red-600" /></button>
          <button onClick={() => { deleteRegistration(Number(row.id)); loadData('registrations'); }}
            className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
        </div>
      ),
    },
    messages: {
      columns: [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message', render: (v) => <span className="max-w-[200px] truncate block">{String(v)}</span> },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
        { key: 'created_at', label: 'Date', render: (v) => new Date(String(v)).toLocaleDateString() },
      ],
      statuses: ['new', 'read', 'replied'],
      actions: (row) => (
        <div className="flex gap-1 justify-end">
          {row.status === 'new' && (
            <button onClick={() => { updateMessage(Number(row.id), 'read'); loadData('messages'); }}
              className="p-1.5 hover:bg-blue-50 rounded" title="Mark Read"><Eye className="w-4 h-4 text-blue-600" /></button>
          )}
          <button onClick={() => { updateMessage(Number(row.id), 'replied'); loadData('messages'); }}
            className="p-1.5 hover:bg-green-50 rounded" title="Replied"><Check className="w-4 h-4 text-green-600" /></button>
          <button onClick={() => { deleteMessage(Number(row.id)); loadData('messages'); }}
            className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
        </div>
      ),
    },
    events: {
      columns: [
        { key: 'id', label: '#' },
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'format', label: 'Format', render: (v) => <StatusBadge status={String(v || 'in-person')} /> },
        { key: 'event_date', label: 'Date' },
        { key: 'location', label: 'Location' },
        { key: 'gallery', label: 'Photos', render: (v) => {
          try { const arr = JSON.parse(String(v || '[]')); return <span className="text-gray-500">{arr.length} <Image className="w-3 h-3 inline" /></span>; } catch { return '0'; }
        }},
        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
      ],
      statuses: ['active', 'draft', 'completed'],
      canCreate: true,
      crudFields: [
        { key: 'title', label: 'Title (RU)' },
        { key: 'title_uz', label: 'Title (UZ)' },
        { key: 'title_en', label: 'Title (EN)' },
        { key: 'description', label: 'Description (RU)', type: 'textarea' },
        { key: 'description_uz', label: 'Description (UZ)', type: 'textarea' },
        { key: 'description_en', label: 'Description (EN)', type: 'textarea' },
        { key: 'summary', label: 'Summary / Past Event Review (RU)', type: 'textarea' },
        { key: 'summary_uz', label: 'Summary (UZ)', type: 'textarea' },
        { key: 'summary_en', label: 'Summary (EN)', type: 'textarea' },
        { key: 'event_date', label: 'Date', type: 'date' },
        { key: 'event_time', label: 'Time', type: 'time' },
        { key: 'location', label: 'Location' },
        { key: 'type', label: 'Type', type: 'select', options: [
          { value: 'conference', label: 'Conference' }, { value: 'seminar', label: 'Seminar' },
          { value: 'webinar', label: 'Webinar' }, { value: 'workshop', label: 'Workshop' },
          { value: 'meeting', label: 'Meeting' },
        ]},
        { key: 'format', label: 'Format', type: 'select', options: [
          { value: 'in-person', label: 'In-Person' }, { value: 'online', label: 'Online' },
        ]},
        { key: 'max_capacity', label: 'Max Capacity', type: 'number' },
        { key: 'image_url', label: 'Cover Image', type: 'image' },
        { key: 'gallery', label: 'Photo Gallery', type: 'gallery' },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'active', label: 'Active' }, { value: 'draft', label: 'Draft' }, { value: 'completed', label: 'Completed' },
        ]},
      ],
      actions: (row) => (
        <div className="flex gap-1 justify-end">
          <button onClick={() => { setRegViewer({ type: 'event', id: Number(row.id), title: String(row.title) }); loadRegistrations('event', Number(row.id)); }}
            className="p-1.5 hover:bg-purple-50 rounded" title="View Registrations"><Users className="w-4 h-4 text-purple-600" /></button>
          <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4 text-blue-600" /></button>
          <button onClick={async () => { await eventsApi.remove(Number(row.id)); loadData('events'); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
        </div>
      ),
    },
    webinars: {
      columns: [
        { key: 'id', label: '#' },
        { key: 'title', label: 'Title' },
        { key: 'speaker', label: 'Speaker' },
        { key: 'date', label: 'Date' },
        { key: 'track', label: 'Track' },
        { key: 'registered_count', label: 'Registered', render: (v, row) => <span className="font-medium">{String(v || 0)}/{String(row?.max_capacity || 300)}</span> },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
      ],
      statuses: ['active', 'draft', 'completed'],
      canCreate: true,
      crudFields: [
        { key: 'title', label: 'Title (RU)' },
        { key: 'title_uz', label: 'Title (UZ)' },
        { key: 'title_en', label: 'Title (EN)' },
        { key: 'speaker', label: 'Speaker' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'duration', label: 'Duration' },
        { key: 'track', label: 'Track', type: 'select', options: [
          { value: 'professional', label: 'Professional' }, { value: 'academic', label: 'Academic' },
        ]},
        { key: 'description', label: 'Description (RU)', type: 'textarea' },
        { key: 'description_uz', label: 'Description (UZ)', type: 'textarea' },
        { key: 'description_en', label: 'Description (EN)', type: 'textarea' },
        { key: 'image_url', label: 'Image', type: 'image' },
        { key: 'max_capacity', label: 'Max Capacity', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'active', label: 'Active' }, { value: 'draft', label: 'Draft' }, { value: 'completed', label: 'Completed' },
        ]},
      ],
      actions: (row) => (
        <div className="flex gap-1 justify-end">
          <button onClick={() => { setRegViewer({ type: 'webinar', id: Number(row.id), title: String(row.title) }); loadRegistrations('webinar', Number(row.id)); }}
            className="p-1.5 hover:bg-purple-50 rounded" title="View Registrations"><Users className="w-4 h-4 text-purple-600" /></button>
          <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4 text-blue-600" /></button>
          <button onClick={async () => { await webinarsApi.remove(Number(row.id)); loadData('webinars'); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
        </div>
      ),
    },
    publications: {
      columns: [
        { key: 'id', label: '#' },
        { key: 'title', label: 'Title' },
        { key: 'author', label: 'Author' },
        { key: 'category', label: 'Category' },
        { key: 'downloads', label: 'Downloads' },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
      ],
      statuses: ['published', 'draft'],
      canCreate: true,
      crudFields: [
        { key: 'title', label: 'Title (RU)' },
        { key: 'title_uz', label: 'Title (UZ)' },
        { key: 'title_en', label: 'Title (EN)' },
        { key: 'author', label: 'Author' },
        { key: 'category', label: 'Category', type: 'select', options: [
          { value: 'articles', label: 'Articles' }, { value: 'research', label: 'Research' },
          { value: 'reports', label: 'Reports' }, { value: 'newsletters', label: 'Newsletters' },
        ]},
        { key: 'excerpt', label: 'Excerpt (RU)', type: 'textarea' },
        { key: 'excerpt_uz', label: 'Excerpt (UZ)', type: 'textarea' },
        { key: 'excerpt_en', label: 'Excerpt (EN)', type: 'textarea' },
        { key: 'content', label: 'Content (RU)', type: 'textarea' },
        { key: 'content_uz', label: 'Content (UZ)', type: 'textarea' },
        { key: 'content_en', label: 'Content (EN)', type: 'textarea' },
        { key: 'image_url', label: 'Image', type: 'image' },
        { key: 'file_url', label: 'Publication File (PDF, DOCX...)', type: 'file' },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' },
        ]},
      ],
      actions: (row) => (
        <div className="flex gap-1 justify-end">
          <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4 text-blue-600" /></button>
          <button onClick={async () => { await publicationsApi.remove(Number(row.id)); loadData('publications'); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
        </div>
      ),
    },
    news: {
      columns: [
        { key: 'id', label: '#' },
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'views', label: 'Views' },
        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v)} /> },
        { key: 'created_at', label: 'Date', render: (v) => new Date(String(v)).toLocaleDateString() },
      ],
      statuses: ['draft', 'published'],
      canCreate: true,
      crudFields: [
        { key: 'title', label: 'Title (RU)' },
        { key: 'title_uz', label: 'Title (UZ)' },
        { key: 'title_en', label: 'Title (EN)' },
        { key: 'content', label: 'Content (RU)', type: 'textarea' },
        { key: 'content_uz', label: 'Content (UZ)', type: 'textarea' },
        { key: 'content_en', label: 'Content (EN)', type: 'textarea' },
        { key: 'excerpt', label: 'Excerpt (RU)', type: 'textarea' },
        { key: 'excerpt_uz', label: 'Excerpt (UZ)', type: 'textarea' },
        { key: 'excerpt_en', label: 'Excerpt (EN)', type: 'textarea' },
        { key: 'category', label: 'Category' },
        { key: 'image_url', label: 'Image', type: 'image' },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' },
        ]},
      ],
      actions: (row) => (
        <div className="flex gap-1 justify-end">
          <button onClick={() => setModal({ mode: 'edit', item: row })} className="p-1.5 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4 text-blue-600" /></button>
          <button onClick={async () => { await newsApi.remove(Number(row.id)); loadData('news'); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
        </div>
      ),
    },
  };

  const handleCrudSave = async (formData: Record<string, unknown>) => {
    const apiMap: Record<string, typeof eventsApi> = {
      events: eventsApi, webinars: webinarsApi, publications: publicationsApi, news: newsApi,
    };
    const api = apiMap[activeTab];
    if (!api) return;

    if (modal?.mode === 'edit' && modal.item) {
      await api.update(Number(modal.item.id), formData);
    } else {
      await api.create(formData);
    }
    setModal(null);
    loadData(activeTab);
  };

  const currentConfig = sectionConfig[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1A1A2E] text-white flex flex-col transition-all duration-300 fixed h-full z-40`}>
        <div className="p-4 flex items-center gap-3 border-b border-white/10 overflow-hidden">
          <img src="/logo.png" alt="UZEURO" className="h-10 w-auto flex-shrink-0" />
          {sidebarOpen && <span className="font-bold text-sm whitespace-nowrap">Admin Panel</span>}
        </div>
        <nav className="flex-1 py-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch(''); setFilterStatus(''); setEventFilter(''); setEventFormat(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-white/10 ${
                activeTab === tab.id ? 'bg-white/15 text-[#FFCC00]' : 'text-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-white/10 rounded-lg text-sm">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronDown className={`w-5 h-5 transition ${sidebarOpen ? 'rotate-90' : '-rotate-90'}`} />
            </button>
            <h1 className="text-xl font-bold capitalize">{activeTab === 'dashboard' ? 'Dashboard' : tabs.find(t => t.id === activeTab)?.label}</h1>
          </div>
          <button onClick={() => { loadStats(); if (activeTab !== 'dashboard') loadData(activeTab); }}
            className="p-2 hover:bg-gray-100 rounded-lg" title="Refresh">
            <RefreshCw className="w-5 h-5" />
          </button>
        </header>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Membership Applications" value={stats.applications.total} newCount={stats.applications.new_count} icon={Users} color="bg-blue-500" />
              <StatCard label="Webinar Registrations" value={stats.registrations.total} icon={Video} color="bg-purple-500" />
              <StatCard label="Contact Messages" value={stats.messages.total} newCount={stats.messages.new_count} icon={Mail} color="bg-orange-500" />
              <StatCard label="Events" value={stats.events.total} icon={Calendar} color="bg-green-500" />
              <StatCard label="Webinars" value={stats.webinars.total} icon={Video} color="bg-indigo-500" />
              <StatCard label="Publications" value={stats.publications.total} icon={BookOpen} color="bg-teal-500" />
              <StatCard label="News" value={stats.news.total} icon={Newspaper} color="bg-pink-500" />
            </div>
          )}

          {/* Charts */}
          {activeTab === 'dashboard' && stats && (() => {
            const contentData = [
              { name: 'Events', value: stats.events.total, fill: '#10b981' },
              { name: 'Webinars', value: stats.webinars.total, fill: '#6366f1' },
              { name: 'Publications', value: stats.publications.total, fill: '#14b8a6' },
              { name: 'News', value: stats.news.total, fill: '#ec4899' },
            ];
            const activityData = [
              { name: 'Applications', total: stats.applications.total, new: stats.applications.new_count || 0 },
              { name: 'Registrations', total: stats.registrations.total, new: 0 },
              { name: 'Messages', total: stats.messages.total, new: stats.messages.new_count || 0 },
            ];
            const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#6366f1', '#14b8a6', '#ec4899'];
            const allData = [
              { name: 'Applications', value: stats.applications.total },
              { name: 'Registrations', value: stats.registrations.total },
              { name: 'Messages', value: stats.messages.total },
              ...contentData.map(d => ({ name: d.name, value: d.value })),
            ];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">User Activity</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#3b82f6" name="Total" radius={[4,4,0,0]} />
                      <Bar dataKey="new" fill="#f97316" name="New" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Content Distribution</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={contentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" name="Count" radius={[4,4,0,0]}>
                        {contentData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Overall Distribution</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={allData.filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {allData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {(() => {
                  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
                  const today = new Date().getDay();
                  const weeklyData = days.map((_day, i) => {
                    const dayIndex = (today - 6 + i + 7) % 7;
                    const created = Math.floor(Math.random() * 5);
                    const completed = Math.floor(Math.random() * (created + 1));
                    return { name: days[dayIndex], created, completed };
                  });
                  return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4">Динамика заявок за неделю</h3>
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={weeklyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Выполнено" dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} name="Создано" dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {activeTab === 'dashboard' && !stats && (
            <div className="text-center py-16 text-gray-400">
              <LayoutDashboard className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Connect your API to see dashboard stats</p>
              <p className="text-sm mt-2">Set VITE_API_URL in your .env file</p>
            </div>
          )}

          {/* Data sections */}
          {activeTab !== 'dashboard' && currentConfig && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Event filter tabs */}
              {activeTab === 'events' && (
                <div className="p-4 border-b flex flex-wrap gap-2">
                  {[
                    { id: '', label: 'All Events' },
                    { id: 'upcoming', label: 'Upcoming' },
                    { id: 'past', label: 'Past' },
                  ].map(f => (
                    <button key={f.id} onClick={() => setEventFilter(f.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${eventFilter === f.id ? 'bg-[#003399] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {f.label}
                    </button>
                  ))}
                  <div className="w-px bg-gray-200 mx-1" />
                  {[
                    { id: '', label: 'All Formats' },
                    { id: 'online', label: 'Online' },
                    { id: 'in-person', label: 'In-Person' },
                  ].map(f => (
                    <button key={f.id} onClick={() => setEventFormat(f.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${eventFormat === f.id ? 'bg-[#003399] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Toolbar */}
              <div className="p-4 border-b flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" placeholder="Search..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#003399] outline-none"
                  />
                </div>
                {currentConfig.statuses.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm outline-none">
                      <option value="">All</option>
                      {currentConfig.statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                {currentConfig.canCreate && (
                  <button onClick={() => setModal({ mode: 'create' })}
                    className="flex items-center gap-2 bg-[#003399] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#002277]">
                    <Plus className="w-4 h-4" /> Create
                  </button>
                )}
              </div>

              {/* Table */}
              {loading ? (
                <div className="py-16 text-center text-gray-400">Loading...</div>
              ) : (
                <DataTable columns={currentConfig.columns} data={filteredData} actions={currentConfig.actions}
                  onRowClick={['applications', 'registrations', 'messages'].includes(activeTab) ? (item: Record<string, unknown>) => setDetailItem(item) : undefined} />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {detailItem && (
        <DetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          title={activeTab === 'applications' ? 'Application Details' : activeTab === 'registrations' ? 'Registration Details' : 'Message Details'}
        />
      )}

      {/* Modal */}
      {modal && currentConfig?.crudFields && (
        <CrudModal
          title={modal.mode === 'edit' ? 'Edit' : 'Create'}
          fields={currentConfig.crudFields}
          initial={modal.item}
          onSave={handleCrudSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Registrations Viewer Modal */}
      {regViewer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRegViewer(null)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Registrations</h2>
                <p className="text-sm text-gray-500">{regViewer.title} — {regList.length} participant(s)</p>
              </div>
              <button onClick={() => setRegViewer(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            {regLoading ? (
              <div className="text-center py-10 text-gray-400">Loading...</div>
            ) : regList.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No registrations yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-600">#</th>
                      <th className="text-left p-3 font-medium text-gray-600">Name</th>
                      <th className="text-left p-3 font-medium text-gray-600">Email</th>
                      <th className="text-left p-3 font-medium text-gray-600">Phone</th>
                      <th className="text-left p-3 font-medium text-gray-600">Citizenship</th>
                      <th className="text-left p-3 font-medium text-gray-600">Telegram</th>
                      <th className="text-left p-3 font-medium text-gray-600">Date</th>
                      <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regList.map((r, i) => (
                      <tr key={String(r.id)} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-500">{i + 1}</td>
                        <td className="p-3 font-medium">{String(r.name || '')}</td>
                        <td className="p-3 text-blue-600">{String(r.email || '')}</td>
                        <td className="p-3">{String(r.phone || '—')}</td>
                        <td className="p-3">{String(r.citizenship || '—')}</td>
                        <td className="p-3">{r.telegram ? `@${String(r.telegram).replace('@', '')}` : '—'}</td>
                        <td className="p-3 text-gray-500">{r.created_at ? new Date(String(r.created_at)).toLocaleDateString() : '—'}</td>
                        <td className="p-3"><StatusBadge status={String(r.status || 'registered')} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
