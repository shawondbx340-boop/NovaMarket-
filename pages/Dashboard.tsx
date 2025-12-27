
import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  Download, 
  Play, 
  ExternalLink, 
  Package, 
  RefreshCw, 
  ShieldCheck,
  Database,
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  Zap,
  CheckCircle,
  AlertCircle,
  Activity,
  Server,
  TrendingUp,
  Layout,
  Settings,
  CreditCard,
  History,
  Briefcase
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
  const [showDebug, setShowDebug] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'activity' | 'billing'>('library');
  
  if (!user) return <Navigate to="/" replace />;

  const purchasedProducts = useMemo(() => {
    return products.filter(p => user.purchasedIds.includes(p.id));
  }, [products, user]);

  const libraryValue = useMemo(() => {
    return purchasedProducts.reduce((sum, p) => sum + p.price, 0);
  }, [purchasedProducts]);

  const handleDownload = (product: Product) => {
    if (!product.fileUrl || product.fileUrl === '#') {
      alert("This item's file link is not yet available.");
      return;
    }
    const link = document.createElement('a');
    link.href = product.fileUrl;
    link.download = `${product.title.replace(/\s+/g, '_')}_NovaMarket.${product.fileType.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-1000">
      {/* Premium Dashboard Header */}
      <div className="relative p-10 rounded-[48px] bg-slate-900/60 border border-white/5 overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-[32px] bg-indigo-600 flex items-center justify-center text-white shadow-2xl ring-4 ring-slate-900 group-hover:scale-105 transition-transform duration-500">
                <UserIcon size={44} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="space-y-1 text-left">
              <h1 className="text-4xl font-black tracking-tighter text-white">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                  {user.role === 'admin' ? 'Root Admin' : 'Pro Creator'}
                </span>
                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
             <button 
                onClick={refreshProfile}
                disabled={isSyncing}
                className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all border border-white/5 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? 'Syncing...' : 'Sync Profile'}
              </button>
              {user.role === 'admin' && (
                <Link to="/admin" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                  <ShieldCheck size={18} /> Admin Core
                </Link>
              )}
          </div>
        </div>
      </div>

      {/* Account Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Assets Owned", value: purchasedProducts.length, icon: <Package className="text-indigo-400" />, sub: "Resources ready" },
          { label: "Account Value", value: `$${libraryValue.toFixed(0)}`, icon: <TrendingUp className="text-emerald-400" />, sub: "Library worth" },
          { label: "Member Rank", value: "Elite", icon: <Briefcase className="text-amber-400" />, sub: "Top 5% of users" },
          { label: "Status", value: "Verified", icon: <CheckCircle className="text-indigo-400" />, sub: "Identity secure" }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-white/5 rounded-[40px] p-8 space-y-4 hover:border-white/10 transition-all group">
            <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center ring-1 ring-white/5 group-hover:scale-110 transition-transform">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
              <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Workspace</p>
          <nav className="flex flex-col gap-2">
            {[
              { id: 'library', label: 'Authorized Library', icon: <Layout size={18} /> },
              { id: 'activity', label: 'Security History', icon: <History size={18} /> },
              { id: 'billing', label: 'Payment Node', icon: <CreditCard size={18} /> }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[40px] space-y-4">
             <Settings className="text-indigo-400" />
             <div className="space-y-1">
               <h4 className="font-black text-white text-xs uppercase tracking-widest">Auto-Deployment</h4>
               <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-wider">New purchases will automatically sync with your local node.</p>
             </div>
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'library' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <Package size={24} className="text-indigo-400" /> Asset Inventory
                </h2>
                <Link to="/marketplace" className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white">Explore More</Link>
              </div>

              {purchasedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {purchasedProducts.map((p) => (
                    <div key={p.id} className="group bg-slate-900 border border-white/5 rounded-[40px] overflow-hidden flex flex-col transition-all hover:border-indigo-500/30 shadow-xl">
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 left-6 flex items-center gap-2">
                           <span className="px-2 py-1 bg-indigo-600 rounded text-[8px] font-black uppercase tracking-tighter text-white">
                             {p.category}
                           </span>
                           <span className="px-2 py-1 bg-slate-950/90 border border-white/10 rounded text-[8px] font-black uppercase tracking-tighter text-slate-400">
                             {p.fileType}
                           </span>
                        </div>
                      </div>
                      <div className="p-8 space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white line-clamp-1">{p.title}</h3>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Size: {p.fileSize}</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleDownload(p)} className="flex-grow py-4 bg-white text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                            <Download size={16} /> Get Package
                          </button>
                          {p.category === 'Courses' && (
                            <Link to={`/course/${p.id}`} className="px-5 py-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 border border-white/5">
                              <Play size={18} className="fill-current" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-24 text-center border-2 border-dashed border-white/5 rounded-[56px] space-y-6 bg-slate-900/10">
                  <div className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center mx-auto text-slate-800"><ShoppingBag size={40} /></div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No assets deployed to this node yet.</p>
                  <Link to="/marketplace" className="inline-block px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Access Market</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-black tracking-tight">Security & Activity Log</h2>
               <div className="space-y-4">
                  {[
                    { event: 'Session Node Sync', date: 'Just now', icon: <RefreshCw size={14} />, color: 'text-indigo-400' },
                    { event: 'Authorized Purchase Success', date: '2 hours ago', icon: <CheckCircle size={14} />, color: 'text-emerald-400' },
                    { event: 'New Resource Downloaded', date: 'Yesterday', icon: <Download size={14} />, color: 'text-blue-400' },
                    { event: 'Identity Verification Successful', date: '3 days ago', icon: <Shield size={14} />, color: 'text-indigo-400' }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-900/50 border border-white/5 rounded-3xl">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 ${log.color}`}>{log.icon}</div>
                          <div>
                            <p className="text-sm font-black text-white">{log.event}</p>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{log.date}</p>
                          </div>
                       </div>
                       <div className="px-3 py-1 bg-slate-950 border border-white/5 rounded-lg text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">Logged</div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="p-16 text-center border-2 border-dashed border-white/5 rounded-[56px] space-y-6 bg-slate-900/10 animate-in fade-in duration-500">
              <CreditCard size={48} className="mx-auto text-slate-800" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Billing node currently synchronized with Stripe Console.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

export default Dashboard;
