import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Navigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  BarChart3, 
  Upload, 
  X, 
  Check, 
  DollarSign, 
  Users, 
  ShoppingBag,
  Image as ImageIcon,
  Search,
  CheckCircle,
  Database,
  Link as LinkIcon,
  MessageSquare,
  Settings,
  Globe,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Tag
} from 'lucide-react';
import { Product, User, Order, Category, ProductRequest } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase, isSupabaseConfigured } from '../supabase';

interface AdminDashboardProps {
  user: User | null;
  products: Product[];
  setProducts: (products: Product[]) => void;
  orders: Order[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, products, setProducts, orders }) => {
  const location = useLocation();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const isPathActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">
      <aside className="w-72 hidden lg:block bg-slate-900 border-r border-slate-800 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-8 space-y-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Management</p>
            <nav className="space-y-1">
              <Link to="/admin" className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all ${isPathActive('/admin') && location.pathname.length <= 7 ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <BarChart3 size={20} /> Dashboard
              </Link>
              <Link to="/admin/products" className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all ${isPathActive('/admin/products') ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <ShoppingBag size={20} /> Inventory
              </Link>
              <Link to="/admin/requests" className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all ${isPathActive('/admin/requests') ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <MessageSquare size={20} /> Requests
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      <main className="flex-grow p-6 lg:p-12">
        <Routes>
          <Route path="/" element={<AdminStats products={products} orders={orders} />} />
          <Route path="/products" element={<AdminProducts products={products} setProducts={setProducts} />} />
          <Route path="/requests" element={<AdminRequests />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminStats: React.FC<{ products: Product[], orders: Order[] }> = ({ products, orders }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const handleClearStorage = () => {
    if (confirm("Reset application cache?")) {
      localStorage.removeItem('nova_products');
      localStorage.removeItem('nova_requests');
      localStorage.removeItem('nova_orders');
      window.location.reload();
    }
  };

  const chartData = [
    { name: 'Mon', revenue: 1200 }, { name: 'Tue', revenue: 1900 }, { name: 'Wed', revenue: 1500 },
    { name: 'Thu', revenue: 2400 }, { name: 'Fri', revenue: 3000 }, { name: 'Sat', revenue: 4200 }, { name: 'Sun', revenue: 3800 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Analytics <span className="text-slate-600">Core</span></h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign />, color: 'text-emerald-400' },
          { label: 'Items', value: String(products.length), icon: <ShoppingBag />, color: 'text-indigo-400' },
          { label: 'Users', value: '8,241', icon: <Users />, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] space-y-6 hover:border-indigo-500/30 transition-all shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 shadow-lg">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-10 rounded-[48px] h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid #334155' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={5} fillOpacity={0.1} fill="#6366f1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[48px] flex flex-col justify-between">
          <div className="space-y-6">
            <Settings className="text-indigo-400" size={32} />
            <h3 className="text-2xl font-black text-white">System</h3>
            <p className="text-slate-500 text-sm">Clear all local storage data and cached assets.</p>
          </div>
          <button onClick={handleClearStorage} className="w-full py-5 bg-slate-800 border border-slate-700 rounded-3xl font-black text-sm flex items-center justify-center gap-3">
            <Database size={18} /> Flush Node Cache
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminProducts: React.FC<{ products: Product[], setProducts: (p: Product[]) => void }> = ({ products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const initialFormState: Partial<Product> = {
    title: '', description: '', price: 0, category: Category.GRAPHICS,
    isFree: true, fileType: 'LINK', fileSize: '0 MB', imageUrl: '',
    fileUrl: '', salesCount: 0, rating: 5.0, createdAt: new Date().toISOString()
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setPreviewImg('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setPreviewImg(product.imageUrl);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const productPayload = {
        title: formData.title, description: formData.description, price: formData.price,
        category: formData.category, image_url: formData.imageUrl, file_url: formData.fileUrl,
        file_type: formData.fileType, file_size: formData.fileSize, is_free: formData.isFree,
        rating: 5.0, sales_count: 0
      };

      if (isSupabaseConfigured) {
        if (editingId) {
          await supabase.from('products').update(productPayload).eq('id', editingId);
        } else {
          await supabase.from('products').insert([productPayload]);
        }
      }
      window.location.reload();
    } catch (err) {
      alert("Failed to save asset.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black text-white">Inventory</h1>
        <button onClick={openAddModal} className="px-8 py-4 bg-indigo-600 text-white rounded-[24px] font-black flex items-center gap-3 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
          <Plus size={20} /> Add Content
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <tr><th className="px-10 py-6">Asset</th><th className="px-6 py-6">Price</th><th className="px-10 py-6 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/20 group">
                <td className="px-10 py-6"><div className="flex items-center gap-4"><img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover" /><p className="font-black text-white">{p.title}</p></div></td>
                <td className="px-6 py-6 font-black text-indigo-400">{p.isFree ? 'FREE' : `$${p.price}`}</td>
                <td className="px-10 py-6 text-right space-x-3">
                  <button onClick={() => openEditModal(p)} className="p-2 text-indigo-400 hover:text-indigo-300"><Edit3 size={16} /></button>
                  <button className="p-2 text-rose-500 hover:text-rose-400"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-xl overflow-y-auto">
          <div className="bg-slate-900 border border-white/5 w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden p-10 space-y-8 animate-in zoom-in duration-300 my-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-white">{editingId ? 'Modify' : 'Create'} Asset</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-800 text-slate-400 rounded-2xl hover:text-white transition-colors"><X /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div onClick={() => imageInputRef.current?.click()} className="aspect-video bg-slate-950 rounded-[32px] border-4 border-dashed border-slate-800 flex items-center justify-center cursor-pointer overflow-hidden group">
                  {previewImg ? <img src={previewImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : (
                    <div className="text-center space-y-2">
                      <ImageIcon size={32} className="text-slate-800 mx-auto" />
                      <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Asset Preview</p>
                    </div>
                  )}
                  <input type="file" hidden ref={imageInputRef} onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const reader = new FileReader();
                      reader.onloadend = () => { setPreviewImg(reader.result as string); setFormData({...formData, imageUrl: reader.result as string}); };
                      reader.readAsDataURL(f);
                    }
                  }} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Title</label>
                  <input required placeholder="Digital Masterclass v2" className="w-full px-6 py-4 bg-slate-800 border border-white/5 rounded-2xl font-bold text-white outline-none focus:border-indigo-500 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Narrative</label>
                  <textarea placeholder="High-end resource description..." rows={3} className="w-full px-6 py-4 bg-slate-800 border border-white/5 rounded-2xl font-bold text-white outline-none focus:border-indigo-500 transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 bg-slate-950 rounded-[32px] border border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={12}/> Access Type
                    </label>
                    <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-white/5">
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, isFree: true, price: 0})} 
                        className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formData.isFree ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        Free
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, isFree: false})} 
                        className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!formData.isFree ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        Premium
                      </button>
                    </div>
                  </div>
                  {!formData.isFree && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Pricing ($)</label>
                       <div className="relative">
                        <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder="49.99"
                          className="w-full pl-10 pr-6 py-3 bg-slate-800 border border-white/5 rounded-xl text-sm font-black text-white outline-none focus:border-indigo-500" 
                          value={formData.price} 
                          onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} 
                        />
                       </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Category Node</label>
                  <select className="w-full px-6 py-4 bg-slate-800 border border-white/5 rounded-2xl font-bold text-white outline-none focus:border-indigo-500 transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                    {(Object.values(Category) as string[]).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Delivery URL</label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input placeholder="https://cdn.nova.io/file" className="w-full pl-10 pr-6 py-4 bg-slate-800 border border-white/5 rounded-2xl font-bold text-white outline-none focus:border-indigo-500 transition-all" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} />
                  </div>
                </div>

                <button type="submit" disabled={isSaving} className="w-full py-5 bg-indigo-600 text-white font-black text-lg rounded-3xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-3">
                  {isSaving ? <Loader2 className="animate-spin" /> : <Globe size={18} />}
                  {editingId ? 'Update Asset' : 'Deploy Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem('nova_requests');
    if (saved) setRequests(JSON.parse(saved));
  }, []);
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <h1 className="text-4xl font-black text-white">Community <span className="text-slate-600">Inquiries</span></h1>
      <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <tr><th className="px-10 py-6">Request</th><th className="px-6 py-6 text-center">Interests</th><th className="px-10 py-6 text-right">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-slate-800/20 transition-all">
                <td className="px-10 py-6 font-black text-white">{r.title}</td>
                <td className="px-6 py-6 text-center"><span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-black rounded-lg border border-indigo-500/10">{r.votes} Votes</span></td>
                <td className="px-10 py-6 text-right uppercase text-[10px] font-black text-slate-400">{r.status}</td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan={3} className="px-10 py-20 text-center text-slate-600 font-black uppercase tracking-[0.2em]">Queue Empty</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;