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
  ChevronUp
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
              <Link to="/admin" className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30">
                <ShieldCheck size={14} /> Open Admin Panel
              </Link>
            ) : (
              <span className="px-3 py-1 bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                Role: {user.role}
              </span>
            )}
          </div>
          <p className="text-slate-500">Managing assets for {user.name}</p>
        </div>
        
        <button 
          onClick={refreshProfile}
          disabled={isSyncing}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 border border-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? 'Checking Database...' : 'Sync Role from Supabase'}
        </button>
      </div>

      {/* System Monitor */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <button onClick={() => setShowDebug(!showDebug)} className="w-full px-8 py-4 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Database size={14} /> System Connection Status
          </div>
          {showDebug ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showDebug && (
          <div className="px-8 pb-8 space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950 rounded-xl border border-white/5">
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Authenticated Email</p>
                <p className="text-xs font-bold text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Database Role</p>
                <p className={`text-xs font-bold ${user.role === 'admin' ? 'text-indigo-400' : 'text-amber-500'}`}>{user.role.toUpperCase()}</p>
              </div>
            </div>
            {user.role !== 'admin' && (
              <p className="text-[10px] text-slate-500 italic">
                * If you changed your role to admin in Supabase but it shows user here, please ensure you didn't have Row Level Security (RLS) enabled on the profiles table without an "Enable Read" policy.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black flex items-center gap-3"><Package size={24} className="text-indigo-400" /> My Library</h2>
          {purchasedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {purchasedProducts.map((product) => (
                <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="font-bold">{product.title}</h3>
                  <button onClick={() => handleDownload(product)} className="w-full py-3 bg-indigo-600 text-white font-black text-xs uppercase rounded-xl">Download</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500">Your digital library is currently empty.</p>
              <Link to="/marketplace" className="mt-4 inline-block text-indigo-400 font-bold">Browse Resources</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;