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
  Unlock
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
  
  if (!user) return <Navigate to="/" replace />;

  const purchasedProducts = useMemo(() => {
    return products.filter(p => user.purchasedIds.includes(p.id));
  }, [products, user]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black">Creator Dashboard</h1>
            {user.role === 'admin' ? (
              <Link to="/admin" className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
                <ShieldCheck size={14} /> Open Admin Panel
              </Link>
            ) : (
              <span className="px-3 py-1 bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                Standard Access
              </span>
            )}
          </div>
          <p className="text-slate-500">Managing workspace for {user.name}</p>
        </div>
        
        <button 
          onClick={refreshProfile}
          disabled={isSyncing}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 border border-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? 'Re-validating...' : 'Sync Database Role'}
        </button>
      </div>

      {/* System Monitor & Security Audit */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden transition-all">
        <button onClick={() => setShowDebug(!showDebug)} className="w-full px-8 py-5 flex items-center justify-between text-slate-400 hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
            <Database size={14} className="text-indigo-400" /> Security & Connection Status
          </div>
          {showDebug ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showDebug && (
          <div className="px-8 pb-8 space-y-6 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                   <Shield size={10} /> Authentication
                </p>
                <p className="text-xs font-bold text-white truncate">{user.email}</p>
              </div>
              <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                   <Lock size={10} /> Access Level
                </p>
                <p className={`text-xs font-black ${user.role === 'admin' ? 'text-indigo-400' : 'text-emerald-500'}`}>
                  {user.role.toUpperCase()}
                </p>
              </div>
              <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                   <Database size={10} /> RLS Protocol
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`} />
                  <span className="text-xs font-bold text-white">Active & Secured</span>
                </div>
              </div>
            </div>

            {user.role === 'admin' ? (
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                <ShieldCheck size={18} className="text-indigo-400 flex-shrink-0" />
                <p className="text-[11px] text-indigo-200/70 leading-relaxed font-medium">
                  <span className="font-black text-indigo-400 uppercase mr-1">Admin Verified:</span> 
                  Your account is correctly mapped to the database admin group. You can now manage products, orders, and system assets with full RLS bypass capabilities.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex items-start gap-3">
                <Unlock size={18} className="text-slate-500 flex-shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  <span className="font-black text-white uppercase mr-1">Public Access:</span> 
                  Row Level Security is ensuring your personal data and purchases are invisible to other users. Only administrators can view your global activity.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black flex items-center gap-3"><Package size={24} className="text-indigo-400" /> My Library</h2>
          {purchasedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {purchasedProducts.map((product) => (
                <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden flex flex-col group hover:border-indigo-500/30 transition-all">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/90 rounded-xl text-[8px] font-black uppercase tracking-widest border border-slate-800">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-black text-lg text-white truncate">{product.title}</h3>
                    <button 
                      onClick={() => handleDownload(product)} 
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Download size={16} /> Download Source
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-24 text-center border-2 border-dashed border-slate-800 rounded-[48px] space-y-6">
              <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto text-slate-700">
                <ShoppingBag size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">No Assets Found</h3>
                <p className="text-slate-500 text-sm font-medium">Your purchased high-fidelity resources will appear here.</p>
              </div>
              <Link to="/marketplace" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
                Browse Marketplace
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;