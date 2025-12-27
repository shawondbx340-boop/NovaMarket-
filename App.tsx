import React, { useState, useEffect } from 'react';
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
  Shield
} from 'lucide-react';
import { Product, User, Order } from './types.ts';
import { INITIAL_PRODUCTS } from './constants.tsx';
import { supabase, isSupabaseConfigured } from './supabase.ts';

// Pages
import Home from './pages/Home.tsx';
import Marketplace from './pages/Marketplace.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import CoursePlayer from './pages/CoursePlayer.tsx';
import StaticPage from './pages/StaticPage.tsx';
import AuthModal from './components/AuthModal.tsx';
import Requests from './pages/Requests.tsx';
import Premium from './pages/Premium.tsx';

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Component for periodic purchase notifications to simulate activity
const PurchaseNotification = ({ products }: { products: Product[] }) => {
  const [notification, setNotification] = useState<{ user: string, product: string } | null>(null);
  const names = ['Liam', 'Emma', 'Noah', 'Olivia', 'James', 'Sophia', 'Ethan', 'Isabella', 'Mia', 'Lucas'];

  useEffect(() => {
    const showNotification = () => {
      if (products.length === 0) return;
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      setNotification({ user: randomName, product: randomProduct.title });
      setTimeout(() => setNotification(null), 5000);
    };

    const interval = setInterval(showNotification, 20000);
    return () => clearInterval(interval);
  }, [products]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-8 left-8 z-[100] animate-in slide-in-from-left-full duration-500">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-xs ring-1 ring-white/10">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bell size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Recent Purchase</p>
          <p className="text-sm font-bold text-white leading-tight">
            {notification.user} just brought <span className="text-indigo-400">"{notification.product}"</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Real-time Supabase Auth Listener
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const appUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            role: session.user.email === 'admin@nova.com' ? 'admin' : 'user',
            purchasedIds: []
          };
          setUser(appUser);
        }
      } catch (e) {
        console.error("Supabase Auth Error:", e);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const appUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || 'User',
          role: session.user.email === 'admin@nova.com' ? 'admin' : 'user',
          purchasedIds: []
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Products from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const getProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.error("Supabase Data Error:", e);
      }
    };
    getProducts();
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <PurchaseNotification products={products} />
      
      <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-indigo-500/30">
        {!isSupabaseConfigured && (
          <div className="bg-amber-600/10 border-b border-amber-600/20 px-4 py-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
            <AlertTriangle size={14} /> 
            Database Offline: Connect VITE_SUPABASE_URL for real-time features.
          </div>
        )}

        <div className="bg-indigo-600 py-2.5 overflow-hidden whitespace-nowrap relative z-50">
          <div className="flex animate-marquee items-center gap-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">⚡ JOIN THE NOVARIAN REVOLUTION TODAY ⚡</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">⚡ JOIN THE NOVARIAN REVOLUTION TODAY ⚡</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">⚡ JOIN THE NOVARIAN REVOLUTION TODAY ⚡</span>
          </div>
        </div>

        <nav className="sticky top-0 z-50 backdrop-blur-xl border-b bg-slate-950/70 border-white/5 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-10">
                <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-400 group flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg rotate-3 group-hover:rotate-0 transition-transform">N</div>
                  <span>NOVA<span className="text-white">MARKET</span></span>
                </Link>
                <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-widest">
                  <Link to="/" className="text-slate-500 hover:text-white transition-colors">Home</Link>
                  <Link to="/marketplace" className="text-slate-500 hover:text-white transition-colors">Resources</Link>
                  <Link to="/requests" className="text-slate-500 hover:text-white transition-colors">Requests</Link>
                  <Link to="/premium" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <Crown size={14} className="fill-current" />
                    Premium
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                      <LayoutDashboard size={14} />
                      <span className="hidden xs:inline">Dashboard</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="p-2.5 rounded-2xl bg-slate-900 border border-white/5 text-slate-400 hover:text-rose-500 transition-all"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                  >
                    Get Started
                  </button>
                )}
                
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/5 bg-slate-900/90 backdrop-blur-2xl p-6 space-y-4 animate-in slide-in-from-top-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white">Home</Link>
              <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white">Resources</Link>
              <Link to="/requests" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white">Requests</Link>
              <Link to="/premium" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300">Premium</Link>
            </div>
          )}
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/marketplace" element={<Marketplace products={products} />} />
            <Route path="/product/:id" element={<ProductDetail products={products} user={user} orders={orders} setOrders={setOrders} setUser={setUser} />} />
            <Route path="/dashboard" element={<Dashboard user={user} products={products} orders={orders} />} />
            <Route path="/admin/*" element={<AdminDashboard user={user} products={products} setProducts={setProducts} orders={orders} />} />
            <Route path="/course/:id" element={<CoursePlayer products={products} user={user} />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/p/:slug" element={<StaticPage />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 border-t border-white/5 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-6">
                <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-400 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">N</div>
                  <span>NOVA<span className="text-white">MARKET</span></span>
                </Link>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  The premier digital distribution network for world-class creators and modern developers.
                </p>
              </div>
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Library</h4>
                <ul className="space-y-4 text-slate-500 text-sm font-bold">
                  <li><Link to="/marketplace?category=Graphics" className="hover:text-white transition-colors">Graphics</Link></li>
                  <li><Link to="/marketplace?category=Courses" className="hover:text-white transition-colors">Courses</Link></li>
                  <li><Link to="/marketplace?category=Development" className="hover:text-white transition-colors">Development</Link></li>
                  <li><Link to="/marketplace?category=E-books" className="hover:text-white transition-colors">E-books</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Support</h4>
                <ul className="space-y-4 text-slate-500 text-sm font-bold">
                  <li><Link to="/p/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/p/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link to="/p/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link to="/p/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Community</h4>
                <ul className="space-y-4 text-slate-500 text-sm font-bold">
                  <li><Link to="/requests" className="hover:text-white transition-colors">Asset Requests</Link></li>
                  <li><Link to="/premium" className="hover:text-white transition-colors">Premium Membership</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">Discord Server</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">© 2025 NOVAMARKET DIGITAL CORP. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-6 text-slate-600">
                <a href="#" className="hover:text-white transition-colors"><Zap size={18} /></a>
                <a href="#" className="hover:text-white transition-colors"><Shield size={18} /></a>
              </div>
            </div>
          </div>
        </footer>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          setUser={setUser} 
        />
      </div>
    </Router>
  );
};

export default App;