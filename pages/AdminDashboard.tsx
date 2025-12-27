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
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  MousePointerClick,
  TrendingUp,
  ChevronDown,
  MessageSquare,
  ThumbsUp,
  Settings,
  RefreshCw,
  Database
} from 'lucide-react';
import { Product, User, Order, Category, ProductRequest } from '../types.ts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  user: User | null;
  products: Product[];
  setProducts: (products: Product[]) => void;
  orders: Order[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, products, setProducts, orders }) => {
  const location = useLocation();
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

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
    if (confirm("WARNING: This will clear your custom product inventory and user requests to free up storage space. Continue?")) {
      localStorage.removeItem('nova_products');
      localStorage.removeItem('nova_requests');
      localStorage.removeItem('nova_orders');
      window.location.reload();
    }
  };

  const chartData = [
    { name: 'Mon', revenue: 1200, views: 400 },
    { name: 'Tue', revenue: 1900, views: 550 },
    { name: 'Wed', revenue: 1500, views: 480 },
    { name: 'Thu', revenue: 2400, views: 700 },
    { name: 'Fri', revenue: 3000, views: 900 },
    { name: 'Sat', revenue: 4200, views: 1200 },
    { name: 'Sun', revenue: 3800, views: 1100 },
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
          { label: 'Avg. Conv Rate', value: '4.82%', delta: '+0.5%', icon: <MousePointerClick />, color: 'text-indigo-400' },
          { label: 'Active Items', value: String(products.length), delta: '+4', icon: <ShoppingBag />, color: 'text-indigo-400' },
          { label: 'Platform Users', value: '8,241', delta: '+12%', icon: <Users />, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] space-y-6 hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {stat.icon as any}
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg">{stat.delta}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-[48px] space-y-8 overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-xl md:text-2xl font-black">Conversion & Traffic</h3>
          </div>
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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[48px] space-y-8 flex flex-col justify-between">
           <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Settings size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">System Health</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Manage your browser storage quota. If you hit storage limits, purge the cache to recover.</p>
              </div>
           </div>
           
           <div className="space-y-4">
              <button 
                onClick={handleClearStorage}
                className="w-full py-5 bg-slate-800 border border-slate-700 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-500 rounded-3xl font-black text-sm flex items-center justify-center gap-3 transition-all"
              >
                <Database size={18} /> Purge App Storage
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const AdminProducts: React.FC<{ products: Product[], setProducts: (p: Product[]) => void }> = ({ products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [previewImg, setPreviewImg] = useState<string>('');
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [attachedFileName, setAttachedFileName] = useState<string>('');
  const [fileMode, setFileMode] = useState<'upload' | 'link'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);

  const initialFormState: Partial<Product> = {
    title: '',
    description: '',
    price: 0,
    category: Category.EBOOKS,
    isFree: false,
    fileType: 'PDF',
    fileSize: '0 MB',
    imageUrl: '',
    additionalImages: [],
    fileUrl: '',
    salesCount: 0,
    rating: 5.0,
    createdAt: new Date().toISOString()
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setPreviewImg('');
    setAdditionalPreviews([]);
    setAttachedFileName('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setPreviewImg(product.imageUrl);
    setAdditionalPreviews(product.additionalImages || []);
    setAttachedFileName(product.fileType === 'LINK' ? '' : 'Current Package');
    setFileMode(product.fileType === 'LINK' ? 'link' : 'upload');
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 400000) {
        alert("Image too large (>400KB).");
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

  const handleAdditionalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        if (file.size > 250000) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setAdditionalPreviews(prev => [...prev, base64]);
          setFormData(prev => ({ 
            ...prev, 
            additionalImages: [...(prev.additionalImages || []), base64] 
          }));
        };
        reader.readAsDataURL(file as Blob);
      });
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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fileUrl && !editingId) {
      alert("Please attach a file.");
      return;
    }

    try {
      if (editingId) {
        const updated = products.map(p => p.id === editingId ? { ...p, ...formData as Product } : p);
        setProducts(updated);
      } else {
        const product: Product = {
          ...formData as Product,
          id: Math.random().toString(36).substr(2, 9),
          imageUrl: formData.imageUrl || 'https://picsum.photos/seed/default/800/600',
        };
        setProducts([product, ...products]);
      }
      setIsModalOpen(false);
    } catch (e) {
      alert("Storage error. Try using smaller images.");
    }
  };

  const deleteProduct = (id: string) => {
    if (confirm("Delete this resource?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-white">Digital Inventory</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage your storefront resources</p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={24} /> Create Resource
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] md:rounded-[48px] overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-800/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <tr>
              <th className="px-10 py-8">Resource</th>
              <th className="px-6 py-8 text-center">Downloads</th>
              <th className="px-6 py-8">Pricing</th>
              <th className="px-10 py-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-all group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <img src={p.imageUrl} className="w-16 h-16 rounded-2xl object-cover border border-slate-800 group-hover:border-indigo-500/50 transition-colors" />
                    <div>
                      <p className="font-black text-white text-lg truncate mb-1">{p.title}</p>
                      <span className="px-2 py-0.5 bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase">{p.category}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-8 text-center text-2xl font-black text-white">{p.salesCount}</td>
                <td className="px-6 py-8 text-2xl font-black text-indigo-400">{p.isFree ? 'FREE' : `$${p.price.toFixed(2)}`}</td>
                <td className="px-10 py-8 text-right space-x-3">
                  <button 
                    onClick={() => openEditModal(p)} 
                    className="inline-flex w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-indigo-400 hover:bg-indigo-600 hover:text-white items-center justify-center transition-all group/btn"
                    title="Edit Product"
                  >
                    <Edit3 size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)} 
                    className="inline-flex w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-slate-500 hover:text-rose-500 hover:border-rose-500/50 items-center justify-center transition-all"
                    title="Delete Product"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={4} className="py-24 text-center text-slate-600 font-bold uppercase tracking-widest">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-[40px] md:rounded-[64px] shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh] overflow-y-auto scrollbar-hide">
              {/* Visual Assets Panel */}
              <div className="p-10 lg:p-16 bg-slate-800/30 border-r border-slate-800 space-y-12">
                <h3 className="text-3xl font-black text-white">Visual Assets</h3>
                <div className="space-y-8">
                  <div 
                    onClick={() => imageInputRef.current?.click()}
                    className="aspect-video rounded-[40px] border-4 border-dashed border-slate-700 hover:border-indigo-500/50 cursor-pointer overflow-hidden flex flex-col items-center justify-center relative group"
                  >
                    {previewImg ? <img src={previewImg} className="w-full h-full object-cover" /> : <ImageIcon size={48} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />}
                    <input type="file" hidden ref={imageInputRef} accept="image/*" onChange={handleImageUpload} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Gallery Images</span>
                      <button type="button" onClick={() => additionalImagesRef.current?.click()} className="text-indigo-400 hover:text-indigo-300">Add More +</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {additionalPreviews.map((img, idx) => (
                        <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-slate-800 relative group">
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div onClick={() => additionalImagesRef.current?.click()} className="aspect-video rounded-xl border-2 border-dashed border-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-800/50 transition-colors">
                        <Plus size={20} className="text-slate-600" />
                      </div>
                    </div>
                    <input type="file" hidden ref={additionalImagesRef} multiple accept="image/*" onChange={handleAdditionalUpload} />
                  </div>
                </div>
              </div>

              {/* Form Panel */}
              <div className="p-10 lg:p-16 space-y-10">
                <div className="flex justify-between items-start">
                  <h2 className="text-4xl font-black text-white">{editingId ? 'Edit Resource' : 'New Resource'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-800 border border-slate-700 rounded-2xl hover:text-rose-400 transition-colors"><X size={24} /></button>
                </div>
                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Title</label>
                    <input required placeholder="Resource Title" className="w-full px-6 py-5 bg-slate-800/50 border border-slate-700 rounded-3xl outline-none focus:border-indigo-500 font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Narrative</label>
                    <textarea required rows={4} placeholder="Description" className="w-full px-6 py-5 bg-slate-800/50 border border-slate-700 rounded-3xl outline-none focus:border-indigo-500 font-bold resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                      <select className="w-full px-6 py-5 bg-slate-800/50 border border-slate-700 rounded-3xl font-bold outline-none focus:border-indigo-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Price ($)</label>
                      <input type="number" step="0.01" className="w-full px-6 py-5 bg-slate-800/50 border border-slate-700 rounded-3xl font-bold outline-none focus:border-indigo-500" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0, isFree: parseFloat(e.target.value) === 0})} />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-6 bg-indigo-600 text-white font-black text-xl rounded-3xl shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                    {editingId ? <><CheckCircle size={24} /> Update Resource</> : <><Plus size={24} /> Publish Resource</>}
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
  const [requests, setRequests] = useState<ProductRequest[]>(() => {
    try {
        const saved = localStorage.getItem('nova_requests');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this user request?")) {
      const filtered = requests.filter(r => r.id !== id);
      setRequests(filtered);
      localStorage.setItem('nova_requests', JSON.stringify(filtered));
    }
  };

  const handleStatusChange = (id: string, status: 'pending' | 'reviewed' | 'fulfilled') => {
    const updated = requests.map(r => r.id === id ? { ...r, status } : r);
    setRequests(updated);
    localStorage.setItem('nova_requests', JSON.stringify(updated));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-white">Community Inquiries</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Monitor user-requested assets</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-[48px] overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-800/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <tr>
              <th className="px-10 py-8">Inquiry</th>
              <th className="px-6 py-8 text-center">Interest</th>
              <th className="px-6 py-8">Workflow</th>
              <th className="px-10 py-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-slate-800/30 transition-all group">
                <td className="px-10 py-8">
                  <p className="font-black text-white text-lg">{r.title}</p>
                  <p className="text-xs text-slate-500 truncate">{r.description}</p>
                </td>
                <td className="px-6 py-8 text-center text-indigo-400 font-black">{r.votes}</td>
                <td className="px-6 py-8">
                  <select 
                    value={r.status || 'pending'} 
                    onChange={e => handleStatusChange(r.id, e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="fulfilled">Fulfilled</option>
                  </select>
                </td>
                <td className="px-10 py-8 text-right">
                  <button onClick={() => handleDelete(r.id)} className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 hover:text-rose-500 transition-all flex items-center justify-center ml-auto">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="py-24 text-center text-slate-600 font-bold uppercase tracking-widest">No active requests</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;