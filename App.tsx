import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  LogOut,
  Crown,
  Bell,
  AlertTriangle,
  Zap,
  Shield,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Product, User, Order } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { supabase, isSupabaseConfigured } from './supabase';

// Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CoursePlayer from './pages/CoursePlayer';
import StaticPage from './pages/StaticPage';
import AuthModal from './components/AuthModal';
import Requests from './pages/Requests';
import Premium from './pages/Premium';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchSessionAndProfile = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile to get role and purchased items
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Profile Fetch Error:", error.message);
        }

        const appUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.name || session.user.user_metadata.full_name || 'User',
          role: profile?.role || 'user',
          purchasedIds: profile?.purchased_ids || []
        };
        setUser(appUser);
        console.log("Logged in as:", appUser.role);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Auth System Error:", e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionAndProfile();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchSessionAndProfile();
    });
    return () => subscription.unsubscribe();
  }, [fetchSessionAndProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const getProducts = async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) {
        setProducts(data.map((p: any) => ({
          ...p,
          imageUrl: p.image_url,
          additionalImages: p.additional_images,
          fileUrl: p.file_url,
          fileType: p.file_type,
          fileSize: p.file_size,
          isFree: p.is_free,
          salesCount: p.sales_count,
          createdAt: p.created_at
        })));
      }
    };
    getProducts();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-indigo-500/30">
        <nav className="sticky top-0 z-50 backdrop-blur-xl border-b bg-slate-950/70 border-white/5 h-20">
          <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-400 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">N</div>
              <span>NOVA<span className="text-white">MARKET</span></span>
            </Link>

            <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-widest">
              <Link to="/marketplace" className="text-slate-500 hover:text-white transition-colors">Resources</Link>
              <Link to="/requests" className="text-slate-500 hover:text-white transition-colors">Requests</Link>
              <Link to="/premium" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"><Crown size={14} /> Premium</Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-black text-[10px] uppercase rounded-xl">
                      <ShieldCheck size={14} /> Admin
                    </Link>
                  )}
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/5 text-white font-black text-[10px] uppercase rounded-xl">
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/marketplace" element={<Marketplace products={products} />} />
            <Route path="/product/:id" element={<ProductDetail products={products} user={user} orders={orders} setOrders={setOrders} setUser={setUser} />} />
            <Route path="/dashboard" element={<Dashboard user={user} products={products} orders={orders} refreshProfile={fetchSessionAndProfile} isSyncing={isSyncing} />} />
            <Route path="/admin/*" element={<AdminDashboard user={user} products={products} setProducts={setProducts} orders={orders} />} />
            <Route path="/course/:id" element={<CoursePlayer products={products} user={user} />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/p/:slug" element={<StaticPage />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 border-t border-white/5 py-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">© 2025 NOVAMARKET DIGITAL CORP.</p>
        </footer>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} setUser={setUser} />
      </div>
    </Router>
  );
};

export default App;