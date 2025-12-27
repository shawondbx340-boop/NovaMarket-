
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Zap, 
  Download, 
  MessageSquare, 
  Users, 
  Package, 
  Crown,
  LayoutGrid,
  Heart,
  Globe,
  Award
} from 'lucide-react';
import { Product, ProductRequest } from '../types.ts';

interface HomeProps {
  products: Product[];
}

const CountUp = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
};

const Home: React.FC<HomeProps> = ({ products }) => {
  const latestResources = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  const [latestRequests, setLatestRequests] = useState<ProductRequest[]>([]);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nova_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLatestRequests(parsed.slice(0, 3));
        setRequestCount(parsed.length);
      } else {
        setRequestCount(0); 
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const revealElements = document.querySelectorAll('.reveal-init');
    revealElements.forEach((el) => observer.observe(el));
    
    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [products, latestRequests]);

  const totalDownloads = products.reduce((acc, p) => acc + p.salesCount, 0);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600 blur-[100px] rounded-full animate-float-delayed" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="reveal-init inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-indigo-400 text-sm font-bold border border-white/5">
            <Zap size={14} className="fill-current" />
            <span className="tracking-widest uppercase text-[10px]">Verified Digital ecosystem</span>
          </div>
          <h1 className="reveal-init delay-100 text-5xl md:text-8xl font-black tracking-tight leading-[1.1]">
            Build Faster <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Dream Bigger</span>
          </h1>
          <p className="reveal-init delay-200 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
            Direct access to thousands of high-fidelity 3D assets, cinematic LUTs, professional courses, and masterfully crafted UI kits.
          </p>
          <div className="reveal-init delay-300 flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/marketplace" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 active:scale-95 group">
              Explore Library <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/premium" className="px-10 py-5 glass-card text-white border border-white/10 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95">
              <Crown size={20} className="text-indigo-400 fill-indigo-400/20" /> Go Premium
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-init">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Resources', val: products.length, icon: <Package />, color: 'text-purple-400' },
            { label: 'Downloads', val: totalDownloads, icon: <Download />, color: 'text-emerald-400' },
            { label: 'Users', val: 0, icon: <Users />, color: 'text-blue-400' },
            { label: 'Requests', val: requestCount, icon: <MessageSquare />, color: 'text-pink-400' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-8 rounded-[40px] text-center space-y-4 hover:bg-slate-800/40 transition-all group">
              <div className={`w-12 h-12 mx-auto rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-white">
                  <CountUp end={stat.val} />
                </p>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="reveal-init flex justify-between items-end">
          <div className="space-y-2 text-left">
            <h2 className="text-4xl font-black tracking-tight text-white">Latest <span className="text-indigo-500">Resources</span></h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Fresh high-quality assets updated hourly</p>
          </div>
          <Link to="/marketplace" className="text-indigo-400 font-black hover:text-white transition-colors flex items-center gap-2 text-sm">
            View All <ChevronRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestResources.length > 0 ? latestResources.map((p, i) => (
            <Link 
              key={p.id} 
              to={`/product/${p.id}`} 
              className="reveal-init group glass-card rounded-[40px] overflow-hidden hover:border-indigo-500/50 transition-all relative" 
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {/* Dynamic Corner Badge */}
                {p.badgeText && (
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border shadow-xl backdrop-blur-md z-10 ${p.isFree ? 'bg-emerald-500/80 border-emerald-400 text-white' : 'bg-indigo-600/80 border-indigo-400 text-white'}`}>
                    {p.badgeText}
                  </div>
                )}
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.category}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={10} className="fill-current" />
                    <span className="text-[10px] font-black">{p.rating}</span>
                  </div>
                </div>
                <h3 className="font-black text-lg line-clamp-1 text-white group-hover:text-indigo-400 transition-colors">{p.title}</h3>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="font-black text-white">{p.isFree ? 'FREE' : `$${p.price}`}</span>
                  <div className="p-2 rounded-lg bg-slate-900 border border-white/5 group-hover:bg-indigo-600 transition-colors">
                    <Download size={14} />
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-slate-700 font-black uppercase tracking-widest">
              Inventory currently empty
            </div>
          )}
        </div>
      </section>

      {/* Trust Footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-init text-center space-y-12 pb-20">
         <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent mx-auto" />
         <div className="space-y-4">
           <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.5em]">The Standard of Digital Excellence</p>
           <div className="flex justify-center flex-wrap gap-10 md:gap-16 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
             <span className="text-2xl font-black">ADOBE</span>
             <span className="text-2xl font-black">UNITY</span>
             <span className="text-2xl font-black">UNREAL</span>
             <span className="text-2xl font-black">FIGMA</span>
             <span className="text-2xl font-black">BLENDER</span>
           </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
