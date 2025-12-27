import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight, Download, Star } from 'lucide-react';
import { Product, Category } from '../types';

interface MarketplaceProps {
  products: Product[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ products }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price_low' | 'price_high'>('newest');

  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-init');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [products, searchTerm, activeTab, sortBy, selectedCategory]);

  const filteredProducts = useMemo(() => {
    let results = [...products];

    if (selectedCategory) {
      results = results.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab === 'free') results = results.filter(p => p.isFree);
    if (activeTab === 'paid') results = results.filter(p => !p.isFree);

    if (sortBy === 'newest') results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === 'popular') results.sort((a, b) => b.salesCount - a.salesCount);
    if (sortBy === 'price_low') results.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_high') results.sort((a, b) => b.price - a.price);

    return results;
  }, [products, selectedCategory, searchTerm, activeTab, sortBy]);

  const toggleCategory = (cat: string | null) => {
    if (cat === null) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
      <div className="space-y-10 reveal-init">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight">Resources</h1>
            <p className="text-slate-500 font-medium text-lg">Curated digital assets for modern creators.</p>
          </div>
          <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/5">
            {(['all', 'free', 'paid'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-black text-sm capitalize transition-all active:scale-95 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Search assets, LUTs, brushes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-6 bg-slate-900 border-2 border-white/5 rounded-[32px] outline-none focus:border-indigo-500 transition-all text-xl font-bold"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide w-full lg:w-auto">
              <button 
                onClick={() => toggleCategory(null)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${!selectedCategory ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500 hover:text-white'}`}
              >
                All Resources
              </button>
              {Object.values(Category).map((cat) => (
                <button 
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto flex-shrink-0">
               <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-indigo-500 text-slate-400 min-w-[180px]"
              >
                <option value="newest">Latest</option>
                <option value="popular">Best Selling</option>
                <option value="price_low">Price: Low-High</option>
                <option value="price_high">Price: High-Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, i) => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="reveal-init group relative flex flex-col glass-card rounded-[40px] overflow-hidden hover:border-indigo-500/50 transition-all hover:-translate-y-2"
              style={{ transitionDelay: `${(i % 3) * 100}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Dynamic Corner Badge */}
                {product.badgeText && (
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border shadow-xl backdrop-blur-md z-10 ${product.isFree ? 'bg-emerald-500/80 border-emerald-400 text-white' : 'bg-indigo-600/80 border-indigo-400 text-white'}`}>
                    {product.badgeText}
                  </div>
                )}
              </div>
              <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xl font-black group-hover:text-indigo-400 transition-colors">{product.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-500">
                    <span className="flex items-center gap-1.5"><Download size={12} /> {product.salesCount}</span>
                    <span className="flex items-center gap-1.5"><Star size={12} className="fill-current text-amber-500" /> {product.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-2xl font-black text-white">
                    {product.isFree ? 'FREE' : `$${product.price}`}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 text-center reveal-init">
            <h3 className="text-2xl font-black mb-4">No results found</h3>
            <button 
              onClick={() => { setSearchTerm(''); toggleCategory(null); setActiveTab('all'); }}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;