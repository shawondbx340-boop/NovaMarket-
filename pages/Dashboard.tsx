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
  AlertCircle,
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

  const userOrders = useMemo(() => {
    return orders.filter(o => o.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, user]);

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
              <Link to="/admin" className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20">
                <ShieldCheck size={12} /> Access Admin Panel
              </Link>
            ) : (
              <span className="px-3 py-1 bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                Standard Member
              </span>
            )}
          </div>
          <p className="text-slate-500">Welcome back, {user.name}.</p>
        </div>
        
        <button 
          onClick={refreshProfile}
          disabled={isSyncing}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? 'Syncing...' : 'Sync Database Role'}
        </button>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-hidden">
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="w-full px-8 py-4 flex items-center justify-between text-slate-400 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Database size={14} /> System Diagnostics
          </div>
          {showDebug ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showDebug && (
          <div className="px-8 pb-8 space-y-4 animate-in slide-in-from-top-2">
            <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">App Detected Role</p>
                  <p className={`text-sm font-bold ${user.role === 'admin' ? 'text-indigo-400' : 'text-amber-500'}`}>
                    {user.role.toUpperCase()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">User ID</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">{user.id}</p>
                </div>
              </div>
              
              {user.role !== 'admin' && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200/70 leading-relaxed">
                    <p className="font-black text-amber-500 uppercase tracking-widest mb-1">Role Sync Warning</p>
                    If you changed your role to "admin" in Supabase but it still says "USER" here, 
                    your database is likely returning an <span className="text-white font-bold">RLS Recursion Error</span>. 
                    Please run the SQL fix provided in the instructions to unlock your profile.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Purchased Library */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Package size={28} className="text-indigo-400" /> Premium Workspace
          </h2>

          {purchasedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {purchasedProducts.map((product) => (
                <div key={product.id} className="bg-slate-800/40 rounded-[40px] overflow-hidden border border-slate-700/50 flex flex-col group hover:border-indigo-500/30 transition-all">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/90 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest border border-slate-700">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black line-clamp-1 group-hover:text-indigo-400 transition-colors">{product.title}</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">{product.fileType} • {product.fileSize}</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleDownload(product)}
                        className="flex-grow py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-500/20"
                      >
                        <Download size={18} /> Download
                      </button>
                      {product.category === 'Courses' && (
                        <Link 
                          to={`/course/${product.id}`}
                          className="px-5 py-4 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500/30 rounded-2xl transition-all"
                        >
                          <Play size={18} className="fill-current" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center bg-slate-800/20 rounded-[48px] border-2 border-dashed border-slate-800 space-y-6">
              <ShoppingBag size={64} className="mx-auto text-slate-800" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Your library is waiting</h3>
                <p className="text-slate-500 font-medium">Elevate your production with our curated premium resources.</p>
              </div>
              <Link to="/marketplace" className="inline-block px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all">
                Browse Digital Assets
              </Link>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Clock size={28} className="text-indigo-400" /> Activity Stream
          </h2>
          
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-[40px] overflow-hidden shadow-sm">
            {userOrders.length > 0 ? (
              <div className="divide-y divide-slate-700/50">
                {userOrders.map((order) => {
                  const product = products.find(p => p.id === order.productId);
                  return (
                    <div key={order.id} className="p-8 space-y-4 hover:bg-slate-700/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TXID: #{order.id.substr(0, 8)}</p>
                          <h4 className="font-bold text-white line-clamp-1">{product?.title || 'Archive Item'}</h4>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">{new Date(order.date).toLocaleDateString()}</span>
                        <span className="font-black text-white">${order.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-20 text-center text-slate-600 font-bold">
                No transaction history found.
              </div>
            )}
          </div>

          <div className="p-10 bg-indigo-600 rounded-[48px] text-white space-y-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
             <div className="space-y-2">
               <h3 className="text-xl font-black">NovaSupport</h3>
               <p className="text-sm text-indigo-100 leading-relaxed font-medium">Facing technical issues with your downloads? Our engineering team is standing by.</p>
             </div>
             <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
               Open Priority Ticket <ExternalLink size={16} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;