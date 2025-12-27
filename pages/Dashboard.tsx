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
  Server
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-1000">
      {/* Professional Header Section */}
      <div className="relative p-10 rounded-[48px] bg-slate-900/40 border border-white/5 overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/20 transition-all duration-1000 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 ring-4 ring-slate-900">
                <Zap size={36} className="fill-current" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter text-white">{user.name}</h1>
              <div className="flex items-center gap-3">
                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Session Node: Active</p>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
             <div className="flex flex-col gap-2 flex-grow sm:flex-grow-0">
                {user.role === 'admin' ? (
                  <Link to="/admin" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 ring-1 ring-white/10">
                    <ShieldCheck size={18} /> Manage Platform
                  </Link>
                ) : (
                  <div className="px-8 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5 cursor-default">
                    <Lock size={16} /> Standard Client
                  </div>
                )}
             </div>
             <button 
                onClick={refreshProfile}
                disabled={isSyncing}
                className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-white/5"
              >
                <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                {isSyncing ? 'Syncing DB...' : 'Force Role Update'}
              </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Digital Library */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Package size={28} className="text-indigo-400" /> Authorized Assets
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-white/5 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <Server size={12} /> Local Index: {purchasedProducts.length}
            </div>
          </div>

          {purchasedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {purchasedProducts.map((product) => (
                <div key={product.id} className="group bg-slate-900 border border-white/5 rounded-[40px] overflow-hidden flex flex-col transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-600/5">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-2">
                       <span className="px-2 py-1 bg-indigo-600 rounded text-[8px] font-black uppercase tracking-tighter text-white">
                         {product.category}
                       </span>
                       <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded text-[8px] font-black uppercase tracking-tighter text-slate-300">
                         {product.fileType}
                       </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{product.title}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Resource Size: {product.fileSize}</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleDownload(product)} 
                        className="flex-grow py-4 bg-white text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Download size={16} /> Download Source
                      </button>
                      {product.category === 'Courses' && (
                        <Link to={`/course/${product.id}`} className="px-5 py-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all border border-white/5">
                          <Play size={18} className="fill-current" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-24 text-center border-2 border-dashed border-white/5 rounded-[56px] space-y-8 bg-slate-900/10">
              <div className="w-24 h-24 bg-slate-900 border border-white/5 rounded-[32px] flex items-center justify-center mx-auto text-slate-800 group-hover:text-indigo-600 transition-colors">
                <ShoppingBag size={48} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white">Empty Workspace</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm leading-relaxed">Your professional digital library is currently dormant. Access the marketplace to deploy new assets.</p>
              </div>
              <Link to="/marketplace" className="inline-block px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-105 transition-all">
                Explore Marketplace
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: System & Diagnostics */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
               <Shield size={14} className="text-indigo-400" /> Security Protocol
            </h3>
            <div className="bg-slate-900 border border-white/5 rounded-[40px] p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-white/5">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-600 uppercase">Current Access Role</p>
                    <p className={`text-sm font-black tracking-tight ${user.role === 'admin' ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {user.role === 'admin' ? 'SYSTEM_ADMIN_ROOT' : 'STANDARD_CLIENT_ACCESS'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${user.role === 'admin' ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`} />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">TLS 1.3 Tunnel</p>
                      <p className="text-[9px] font-bold text-slate-600">Secure AES-256 Protocol</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${user.role === 'admin' ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
                      <Database size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Row Policy Check</p>
                      <p className="text-[9px] font-bold text-slate-600">{user.role === 'admin' ? 'RLS Superuser Override' : 'RLS Isolation Active'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowDebug(!showDebug)}
                className="w-full py-4 bg-slate-950 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2 group"
              >
                {showDebug ? 'Close Terminal' : 'Diagnostic Terminal'} 
                {showDebug ? <ChevronUp size={12} /> : <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />}
              </button>
              
              {showDebug && (
                <div className="pt-2 space-y-3 animate-in slide-in-from-top-4">
                  <div className="p-5 bg-slate-950 rounded-3xl border border-white/5 font-mono text-[10px] text-slate-500 space-y-2 leading-relaxed shadow-inner">
                    <div className="flex gap-2">
                      <span className="text-indigo-500">[0.00ms]</span>
                      <span>INITIALIZING DIAGNOSTICS...</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-emerald-500">[OK]</span>
                      <span>USER_ID: {user.id.substring(0, 16)}...</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-emerald-500">[OK]</span>
                      <span className="font-bold text-white underline">ROLE_SYNC: {user.role.toUpperCase()}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-amber-500">[INF]</span>
                      <span>If role is incorrect, trigger Force Update.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Support Widget */}
          <div className="relative p-10 rounded-[48px] bg-indigo-600 text-white space-y-6 shadow-2xl shadow-indigo-600/30 group overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-white/20">
               <ShieldCheck size={32} />
             </div>
             <div className="space-y-2">
               <h4 className="text-2xl font-black tracking-tight">Technical Access?</h4>
               <p className="text-indigo-100 text-xs font-medium leading-relaxed">Our engineering team can manually override account permissions if your role sync fails.</p>
             </div>
             <button className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all active:scale-95 shadow-xl">
               Contact Engineering <ExternalLink size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;