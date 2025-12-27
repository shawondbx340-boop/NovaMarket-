import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Download, 
  Play, 
  Package, 
  RefreshCw, 
  ShieldCheck,
  CheckCircle,
  Activity,
  Layout,
  Settings,
  CreditCard,
  History,
  TrendingUp,
  User as UserIcon,
  ChevronRight,
  Zap,
  Globe,
  Star,
  MessageSquare
} from 'lucide-react';
import { User, Product, Order } from '../types';

interface DashboardProps {
  user: User | null;
  products: Product[];
  orders: Order[];
  refreshProfile: () => void;
  isSyncing?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, products, orders, refreshProfile, isSyncing }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'activity' | 'billing'>('library');
  
  if (!user) return <Navigate to="/" replace />;

  const purchasedProducts = useMemo(() => {
    return products.filter(p => user.purchasedIds.includes(p.id));
  }, [products, user]);

  const handleDownload = (product: Product) => {
    if (!product.fileUrl || product.fileUrl === '#') {
      alert("Asset delivery link pending.");
      return;
    }
    const link = document.createElement('a');
    link.href = product.fileUrl;
    link.download = `${product.title.replace(/\s+/g, '_')}_Nova.${product.fileType.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Premium Profile Header */}
      <div className="relative p-10 rounded-[48px] bg-slate-900 border border-white/5 overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-[32px] bg-indigo-600 flex items-center justify-center text-white shadow-2xl ring-4 ring-indigo-600/20">
              <UserIcon size={48} />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">{user.name}</h1>
              <div className="flex items-center gap-3">
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">{user.email}</p>
                <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-500 font-black text-[8px] uppercase tracking-widest">Authorized</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
             <button onClick={refreshProfile} disabled={isSyncing} className="px-8 py-3.5 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 border border-white/5 hover:bg-slate-700 hover:border-white/10 transition-all active:scale-95 shadow-lg">
                <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} /> Sync Profile
              </button>
              {user.role === 'admin' && (
                <Link to="/admin" className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all ring-1 ring-white/10">
                  <ShieldCheck size={14} /> Admin Hub
                </Link>
              )}
          </div>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Assets Authorized", value: purchasedProducts.length, icon: <Package className="text-indigo-400" /> },
          { label: "Platform Rank", value: "Novarian Pro", icon: <TrendingUp className="text-emerald-400" /> },
          { label: "Community", value: "Verified", icon: <Globe className="text-purple-400" /> },
          { label: "Reward Points", value: "2,440", icon: <Star className="text-amber-400" /> }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-white/5 rounded-[40px] p-10 space-y-6 shadow-2xl hover:border-indigo-500/30 transition-all group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-colors" />
            <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-white/5">{stat.icon}</div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Command Center Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <nav className="flex flex-col gap-2 p-5 bg-slate-900 border border-white/5 rounded-[40px] shadow-2xl">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] px-5 py-4">Terminal Navigation</p>
            {[
              { id: 'library', label: 'Vault Library', icon: <Layout size={18} /> },
              { id: 'activity', label: 'Security Log', icon: <Activity size={18} /> },
              { id: 'billing', label: 'Billing Node', icon: <CreditCard size={18} /> }
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex items-center gap-5 px-6 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] transition-all group ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 ring-1 ring-white/10' : 'text-slate-500 hover:text-white hover:bg-slate-800 border border-transparent hover:border-white/5'}`}
              >
                <span className={`transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-white' : 'text-indigo-400'}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="p-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[40px] text-white space-y-6 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/20 backdrop-blur-md">
              <MessageSquare size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black leading-tight tracking-tight">Direct Support</h4>
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest leading-relaxed opacity-80">Priority assistance available 24/7 for Elite members.</p>
            </div>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-xl">Contact Engineer</button>
          </div>
        </aside>

        {/* Dynamic Content Pane */}
        <div className="lg:col-span-9 min-h-[600px]">
          {activeTab === 'library' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-12 duration-700">
              {purchasedProducts.length > 0 ? purchasedProducts.map((p, idx) => (
                <div 
                  key={p.id} 
                  className="bg-slate-900 border border-white/5 rounded-[48px] overflow-hidden hover:border-indigo-500/40 transition-all group shadow-2xl relative"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-6 left-6 flex gap-2">
                       <span className="px-4 py-1.5 bg-indigo-600/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-white shadow-2xl border border-white/10 tracking-widest">{p.category}</span>
                    </div>
                  </div>
                  <div className="p-10 space-y-8">
                    <h3 className="text-2xl font-black text-white tracking-tight">{p.title}</h3>
                    <div className="flex gap-4">
                      <button onClick={() => handleDownload(p)} className="flex-grow py-5 bg-white text-slate-950 font-black text-[11px] uppercase tracking-widest rounded-3xl flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl">
                        <Download size={18} /> Download Asset
                      </button>
                      {p.category === 'Courses' && (
                        <Link to={`/course/${p.id}`} className="w-16 h-16 bg-slate-800 text-indigo-400 rounded-3xl border border-white/5 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95">
                          <Play size={24} fill="currentColor" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-40 text-center border-4 border-dashed border-white/5 rounded-[56px] space-y-6 bg-slate-900/40 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600 border border-white/5">
                    <Package size={48} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-white">Vault Empty</p>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Initialize your collection today</p>
                  </div>
                  <Link to="/marketplace" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-105 transition-all">
                    Browse Marketplace <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-12 duration-700">
              {[
                { event: 'Authorized Login', time: 'Just now', icon: <Activity className="text-indigo-400" />, status: 'Success' },
                { event: 'Database Sync Completed', time: '2 hours ago', icon: <RefreshCw className="text-emerald-400" />, status: 'Optimized' },
                { event: 'Asset Vault Initialized', time: 'Yesterday', icon: <CheckCircle className="text-purple-400" />, status: 'Verified' }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-8 bg-slate-900 border border-white/5 rounded-[40px] hover:bg-slate-800/80 transition-all group shadow-xl">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:border-indigo-500/20">{log.icon}</div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-white tracking-tight">{log.event}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{log.time}</p>
                          <span className="w-1 h-1 rounded-full bg-slate-800" />
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{log.status}</p>
                        </div>
                      </div>
                   </div>
                   <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-slate-800 group-hover:text-indigo-500 group-hover:border-indigo-500/20 transition-all">
                    <ChevronRight size={18} />
                   </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="p-20 text-center border border-white/5 rounded-[56px] bg-slate-900/60 backdrop-blur-xl animate-in fade-in slide-in-from-right-12 duration-700 shadow-2xl space-y-10">
              <div className="w-24 h-24 rounded-[32px] bg-indigo-600/10 flex items-center justify-center mx-auto text-indigo-500 border border-indigo-500/20">
                <CreditCard size={48} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white tracking-tight">Billing Vault</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">Access restricted. Billing nodes and payment methods are managed via our encrypted gateway.</p>
              </div>
              <button className="px-12 py-5 bg-indigo-600 text-white rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 transition-all active:scale-95 ring-1 ring-white/10">Manage Subscription Node</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;