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
  ChevronRight
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
      <div className="relative p-10 rounded-[48px] bg-slate-900 border border-white/5 overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shadow-xl">
              <UserIcon size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white">{user.name}</h1>
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={refreshProfile} disabled={isSyncing} className="px-6 py-3 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-white/5">
                <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} /> Sync Data
              </button>
              {user.role === 'admin' && (
                <Link to="/admin" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} /> Admin Core
                </Link>
              )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Assets Owned", value: purchasedProducts.length, icon: <Package className="text-indigo-400" /> },
          { label: "Rank", value: "Elite", icon: <TrendingUp className="text-emerald-400" /> },
          { label: "Activity", value: "Active", icon: <Activity className="text-purple-400" /> },
          { label: "Status", value: "Verified", icon: <CheckCircle className="text-indigo-400" /> }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-white/5 rounded-[32px] p-8 space-y-4 shadow-lg">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 space-y-4">
          <nav className="flex flex-col gap-2">
            {[
              { id: 'library', label: 'Authorized Library', icon: <Layout size={16} /> },
              { id: 'activity', label: 'Access History', icon: <History size={16} /> },
              { id: 'billing', label: 'Billing Node', icon: <CreditCard size={16} /> }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3">
          {activeTab === 'library' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
              {purchasedProducts.length > 0 ? purchasedProducts.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-white/5 rounded-[40px] overflow-hidden hover:border-indigo-500/30 transition-all group">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="px-2 py-1 bg-indigo-600 rounded text-[8px] font-black uppercase text-white">{p.category}</span>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <h3 className="text-xl font-black text-white">{p.title}</h3>
                    <div className="flex gap-3">
                      <button onClick={() => handleDownload(p)} className="flex-grow py-4 bg-white text-slate-950 font-black text-[10px] uppercase rounded-2xl flex items-center justify-center gap-2">
                        <Download size={14} /> Download
                      </button>
                      {p.category === 'Courses' && (
                        <Link to={`/course/${p.id}`} className="px-6 py-4 bg-slate-800 text-white rounded-2xl border border-white/5">
                          <Play size={16} fill="currentColor" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-slate-700 font-black uppercase tracking-widest">Library empty</div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4 animate-in fade-in duration-500">
              {[
                { event: 'Authorized Login', time: 'Just now', color: 'text-indigo-400' },
                { event: 'Purchase Confirmed', time: '2 days ago', color: 'text-emerald-400' }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-900 border border-white/5 rounded-3xl">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center ${log.color}`}><CheckCircle size={14} /></div>
                      {/* Fixed property name from date to time to match structure */}
                      <div><p className="text-sm font-black text-white">{log.event}</p><p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{log.time}</p></div>
                   </div>
                   <ChevronRight size={14} className="text-slate-800" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;