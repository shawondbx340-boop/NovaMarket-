
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
      {/* Admin Sidebar - Desktop */}
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
              <Link to="/admin/orders" className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all ${isPathActive('/admin/orders') ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <DollarSign size={20} /> Sales
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-grow p-6 lg:p-12">
        <Routes>
          <Route path="/" element={<AdminStats products={products} orders={orders} />} />
          <Route path="/products" element={<AdminProducts products={products} setProducts={setProducts} />} />
          <Route path="/requests" element={<AdminRequests />} />
          <Route path="/orders" element={<div className="py-20 text-center text-slate-500 font-bold uppercase tracking-[0.2em]">Sales History Module Under Maintenance</div>} />
        </Routes>
      </main>
    </div>
  );
};

const AdminStats: React.FC<{ products: Product[], orders: Order[] }> = ({ products, orders }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  
  const handleClearStorage = () => {
    if (confirm("WARNING: This will clear your custom product inventory and user requests. Continue?")) {
      localStorage.removeItem('nova_products');
      localStorage.removeItem('nova_requests');
      localStorage.removeItem('nova_orders');
      window.location.reload();
    }
  };

  const chartData = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 1900 },
    { name: 'Wed', revenue: 1500 },
    { name: 'Thu', revenue: 2400 },
    { name: 'Fri', revenue: 3000 },
    { name: 'Sat', revenue: 4200 },
    { name: 'Sun', revenue: 3800 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Analytics <span className="text-slate-600">Overview</span></h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Global Platform Performance Metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { label: 'Total Sales', value: `$${totalRevenue.toFixed(2)}`, delta: '+15.2%', icon: <DollarSign />, color: 'text-emerald-400' },
          { label: 'Market Items', value: String(products.length), delta: '+4', icon: <ShoppingBag />, color: 'text-indigo-400' },
          { label: 'Platform Users', value: '8,241', delta: '+12%', icon: <Users />, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] space-y-6 hover:border-indigo-500/30 transition-all group shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg shadow-black/20">
                {stat.icon as any}
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg border border-emerald-500/10">{stat.delta}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-[48px] space-y-8 overflow-hidden relative">
          <h3 className="text-xl md:text-2xl font-black">Performance Chart</h3>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid #334155', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[48px] space-y-8 flex flex-col justify-between">
           <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/10"><Settings size={32} /></div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Management</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">System-wide data flushing. Useful for clearing cached sessions or local diagnostic data.</p>
              </div>
           </div>
           <button onClick={handleClearStorage} className="w-full py-5 bg-slate-800 border border-slate-700 hover:text-rose-500 rounded-3xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl">
             <Database size={18} /> Reset Application Cache
           </button>
        </div>
      </div>
    </div>
  );
};

const AdminProducts: React.FC<{ products: Product[], setProducts: (p: Product[]) => void }> = ({ products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string>('');
  const [attachedFileName, setAttachedFileName] = useState<string>('');
  const [fileMode, setFileMode] = useState<'upload' | 'link'>('link');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const initialFormState: Partial<Product> = {
    title: '',
    description: '',
    price: 0,
    category: Category.GRAPHICS,
    isFree: false,
    badgeText: '', 
    fileType: 'LINK',
    fileSize: '0 MB',
    imageUrl: '',
    additionalImages: [],
    fileUrl: '',
    salesCount: 0,
    rating: 5.0,
    createdAt: new Date().toISOString()
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setPreviewImg('');
    setAttachedFileName('');
    setFileMode('link');
    setErrorStatus(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setPreviewImg(product.imageUrl);
    setAttachedFileName(product.fileType !== 'LINK' ? 'Current Package' : '');
    setFileMode(product.fileType === 'LINK' ? 'link' : 'upload');
    setErrorStatus(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10000000) {
        alert("Image too large. Please use a file under 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewImg(base64);
        setFormData(prev => ({ ...prev, imageUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      const size = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      const ext = file.name.split('.').pop()?.toUpperCase() || 'DATA';
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          fileUrl: reader.result as string,
          fileSize: size,
          fileType: ext
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fileUrl) {
      alert("Error: No delivery source attached.");
      return;
    }

    setIsSaving(true);
    setErrorStatus(null);

    try {
      const productPayload = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        image_url: formData.imageUrl,
        additional_images: formData.additionalImages || [],
        file_url: formData.fileUrl,
        file_type: formData.fileType,
        file_size: formData.fileSize,
        is_free: formData.isFree,
        badge_text: formData.badgeText,
        rating: formData.rating || 5.0,
        sales_count: formData.salesCount || 0
      };

      if (isSupabaseConfigured) {
        let res;
        if (editingId) {
          res = await supabase.from('products').update(productPayload).eq('id', editingId);
        } else {
          res = await supabase.from('products').insert([productPayload]);
        }
        
        if (res.error) {
          if (res.error.code === '42501') {
             throw new Error("Permission Denied: Your database RLS policies are blocking this action.");
          }
          throw res.error;
        }
      }

      window.location.reload(); 
    } catch (err: any) {
      console.error("Management Error:", err);
      setErrorStatus(err.message || "Failed to sync with database.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Permanently delete this resource?")) {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
           alert("Failed to delete.");
           console.error(error);
        } else {
           window.location.reload();
        }
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-white">Inventory</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Platform Content Management</p>
        </div>
        <button onClick={openAddModal} className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-indigo-500 transition-all active:scale-95">
          <Plus size={24} /> Add Content
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-10 py-8">Resource Asset</th>
              <th className="px-6 py-8">Conversions</th>
              <th className="px-6 py-8">Unit Price</th>
              <th className="px-10 py-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/20 transition-all group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                      <img src={p.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-black text-white truncate max-w-[240px] tracking-tight">{p.title}</p>
                  </div>
                </td>
                <td className="px-6 py-8 font-black text-slate-400">{p.salesCount}</td>
                <td className="px-6 py-8 font-black text-indigo-400">{p.isFree ? 'FREE' : `$${p.price.toFixed(2)}`}</td>
                <td className="px-10 py-8 text-right space-x-3">
                  <button onClick={() => openEditModal(p)} className="inline-flex w-10 h-10 rounded-xl bg-slate-800/80 text-indigo-400 items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-lg"><Edit3 size={16} /></button>
                  <button onClick={() => deleteProduct(p.id)} className="inline-flex w-10 h-10 rounded-xl bg-slate-800/80 text-rose-500 items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-lg"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-xl overflow-y-auto">
          <div className="bg-slate-900 border border-white/5 w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden relative animate-in zoom-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh] overflow-y-auto">
              <div className="p-10 lg:p-16 bg-slate-950/40 border-r border-white/5 space-y-12">
                <h3 className="text-3xl font-black text-white tracking-tighter">Asset Metadata</h3>
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className="aspect-video rounded-[40px] border-4 border-dashed border-slate-800 hover:border-indigo-500/50 cursor-pointer overflow-hidden flex items-center justify-center group bg-slate-900 shadow-inner"
                >
                  {previewImg ? <img src={previewImg} className="w-full h-full object-cover transition-transform group-hover:scale-105" /> : (
                    <div className="flex flex-col items-center gap-4 text-slate-700">
                      <ImageIcon size={48} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Upload Cover</span>
                    </div>
                  )}
                  <input type="file" hidden ref={imageInputRef} accept="image/*" onChange={handleImageUpload} />
                </div>
                
                <div className="space-y-6">
                   <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Fulfillment Delivery</span>
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button type="button" onClick={() => setFileMode('link')} className={`px-4 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${fileMode === 'link' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Link</button>
                      <button type="button" onClick={() => setFileMode('upload')} className={`px-4 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${fileMode === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Binary</button>
                    </div>
                   </div>
                   
                   {fileMode === 'link' ? (
                     <input 
                       type="url" 
                       placeholder="Resource URL (e.g., Drive / Dropbox)"
                       className="w-full px-6 py-5 bg-slate-950 border border-slate-800 rounded-3xl font-bold outline-none focus:border-indigo-500 shadow-inner text-sm"
                       value={formData.fileUrl === 'Link source' ? '' : formData.fileUrl}
                       onChange={e => setFormData({...formData, fileUrl: e.target.value, fileType: 'LINK', fileSize: 'Managed Link'})}
                     />
                   ) : (
                     <div onClick={() => fileInputRef.current?.click()} className="p-10 rounded-[32px] bg-slate-950 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 cursor-pointer flex flex-col items-center justify-center text-center gap-4">
                        <Upload size={32} className="text-indigo-500" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{attachedFileName || "Attach Resource Binary"}</span>
                        <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} />
                      </div>
                   )}
                </div>
              </div>

              <div className="p-10 lg:p-16 space-y-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-4xl font-black text-white tracking-tighter">{editingId ? 'Modify' : 'Initialize'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-800 text-slate-500 rounded-2xl hover:text-rose-400 border border-white/5"><X /></button>
                </div>

                {errorStatus && (
                  <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-[28px] flex items-start gap-4 text-rose-500 animate-in slide-in-from-top-4">
                    <ShieldAlert className="flex-shrink-0" size={20} />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest">Security Exception</p>
                      <p className="text-xs font-bold leading-relaxed">{errorStatus}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Marketplace Title</label>
                    <input required className="w-full px-6 py-5 bg-slate-800/40 border border-white/5 rounded-3xl font-black outline-none focus:border-indigo-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  
                  {/* Enhanced Pricing & Tag Section */}
                  <div className="p-6 bg-slate-950 border border-white/5 rounded-[32px] space-y-6">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Tag size={12}/> Marketing & Pricing</label>
                       <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{formData.isFree ? 'Free Access' : 'Paid Asset'}</span>
                         <button 
                           type="button"
                           onClick={() => setFormData({...formData, isFree: !formData.isFree, price: !formData.isFree ? 0 : formData.price})}
                           className={`w-12 h-6 rounded-full relative transition-all ${formData.isFree ? 'bg-emerald-500' : 'bg-slate-700'}`}
                         >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFree ? 'right-1' : 'left-1'}`} />
                         </button>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Badge / Tag (e.g. NEW)</label>
                        <input placeholder="NEW, HOT, 50% OFF" className="w-full px-6 py-4 bg-slate-800/40 border border-white/5 rounded-2xl font-black outline-none focus:border-indigo-500" value={formData.badgeText || ''} onChange={e => setFormData({...formData, badgeText: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Price ($)</label>
                        <input disabled={formData.isFree} type="number" step="0.01" className="w-full px-6 py-4 bg-slate-800/40 border border-white/5 rounded-2xl font-black outline-none disabled:opacity-30" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Resource Group</label>
                    <select className="w-full px-6 py-5 bg-slate-800/40 border border-white/5 rounded-3xl font-black outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                      {(Object.values(Category) as string[]).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Product Narrative</label>
                    <textarea rows={4} className="w-full px-6 py-5 bg-slate-800/40 border border-white/5 rounded-3xl font-bold resize-none outline-none focus:border-indigo-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  
                  <button type="submit" disabled={isSaving} className="w-full py-6 bg-indigo-600 text-white font-black text-xl rounded-[32px] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 ring-1 ring-white/10">
                    {isSaving ? <Loader2 className="animate-spin" /> : <Globe size={24} />}
                    {editingId ? 'Update & Deploy' : 'Initialize & Deploy'}
                  </button>
                </form>
              </div>
            </div>
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

  const handleDelete = (id: string) => {
    const filtered = requests.filter(r => r.id !== id);
    setRequests(filtered);
    localStorage.setItem('nova_requests', JSON.stringify(filtered));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <h1 className="text-4xl font-black text-white">Community Assets</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-10 py-8">Inquiry Subject</th>
              <th className="px-6 py-8">Public Interest</th>
              <th className="px-10 py-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-slate-800/20 group transition-all">
                <td className="px-10 py-8 font-black text-white">{r.title}</td>
                <td className="px-6 py-8"><span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 font-black rounded-lg text-xs border border-indigo-500/10">{r.votes} Votes</span></td>
                <td className="px-10 py-8 text-right">
                  <button onClick={() => handleDelete(r.id)} className="text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
