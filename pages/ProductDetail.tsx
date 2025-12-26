
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Download, 
  ShoppingBag, 
  Star, 
  FileText, 
  HardDrive, 
  CheckCircle2, 
  Play, 
  Clock, 
  ArrowLeft,
  Share2,
  Lock,
  Zap,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { Product, User, Order } from '../types';

interface ProductDetailProps {
  products: Product[];
  user: User | null;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  setUser: (user: User) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, user, orders, setOrders, setUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  
  const product = useMemo(() => products.find(p => p.id === id), [products, id]);
  const [activeImage, setActiveImage] = useState<string>('');

  // Update active image when product is loaded
  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  useEffect(() => {
    if (showShareToast) {
      const timer = setTimeout(() => setShowShareToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showShareToast]);

  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <Link to="/marketplace" className="text-indigo-400 font-bold underline">Back to Marketplace</Link>
    </div>
  );

  const isPurchased = user?.purchasedIds.includes(product.id);
  const showBuyButton = !product.isFree && !isPurchased;
  const showDownloadButton = product.isFree || isPurchased;

  const handlePurchase = () => {
    if (!user) {
      alert("Please login to purchase products.");
      return;
    }

    setIsPurchasing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        productId: product.id,
        amount: product.price,
        date: new Date().toISOString(),
        status: 'completed'
      };

      setOrders([...orders, newOrder]);
      
      const updatedUser = {
        ...user,
        purchasedIds: [...user.purchasedIds, product.id]
      };
      setUser(updatedUser);
      
      setIsPurchasing(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleDownload = () => {
    if (!product.fileUrl || product.fileUrl === '#') {
      alert("Error: Download link is not configured for this item. Please contact support.");
      return;
    }

    const link = document.createElement('a');
    link.href = product.fileUrl; 
    link.download = `${product.title.replace(/\s+/g, '_')}_NovaMarket.${product.fileType.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Your download for "${product.title}" has started!`);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShowShareToast(true);
    });
  };

  const gallery = [product.imageUrl, ...(product.additionalImages || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-bold transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={18} /> Back to Library
          </button>
          
          <div className="relative">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 hover:text-indigo-400 hover:border-indigo-400/50 rounded-xl transition-all font-bold text-sm"
            >
              <Share2 size={16} /> Share Product
            </button>
            {showShareToast && (
              <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-xl animate-in fade-in zoom-in slide-in-from-top-2 whitespace-nowrap z-50">
                Link copied to clipboard!
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images/Preview */}
          <div className="space-y-8">
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl bg-slate-800 aspect-video group border border-slate-800">
              <img 
                src={activeImage || product.imageUrl} 
                alt={product.title} 
                className="w-full h-full object-cover transition-all duration-700"
              />
              
              {/* Corner Badge - Using z-20 to ensure it stays on top */}
              <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-2xl backdrop-blur-md z-20 ${product.isFree ? 'bg-emerald-500/80 border-emerald-400 text-white' : 'bg-indigo-600/80 border-indigo-400 text-white'}`}>
                {product.isFree ? 'FREE' : 'PAID'}
              </div>

              {product.category === 'Courses' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all cursor-pointer group/play z-10">
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover/play:scale-110 group-hover/play:bg-indigo-600/30 transition-all duration-500 shadow-2xl">
                    <Play size={48} className="text-white fill-white ml-2" />
                  </div>
                </div>
              )}
              <div className="absolute top-6 left-6 px-5 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-700 z-10">
                {product.category}
              </div>
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`rounded-2xl overflow-hidden aspect-video bg-slate-800 border transition-all hover:scale-105 active:scale-95 ${activeImage === img ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-slate-700 hover:border-slate-500'}`}
                >
                  <img src={img} className="w-full h-full object-cover pointer-events-none" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">{product.title}</h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-lg">
                  <Star size={18} className="fill-current" />
                  <span>{product.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-lg">
                  <Download size={18} />
                  <span>{product.salesCount.toLocaleString()} Downloads</span>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[48px] bg-slate-800/40 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current Price</p>
                  <p className="text-5xl font-black text-white">
                    {product.isFree ? 'FREE' : `$${product.price}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">License Info</p>
                  <p className="text-sm font-bold text-green-400 flex items-center justify-end gap-1.5">
                    <CheckCircle2 size={16} /> Full Commercial Usage
                  </p>
                </div>
              </div>

              {showSuccess ? (
                <div className="p-8 bg-green-950/20 border border-green-800/50 rounded-[32px] flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-2xl font-black text-white">Purchase Confirmed!</p>
                    <p className="text-slate-400 font-medium">Your assets are ready for download.</p>
                  </div>
                  <button 
                    onClick={handleDownload}
                    className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-green-500/30 flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Download size={24} /> Download Package
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {showBuyButton && (
                    <button 
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl transition-all shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 group/btn"
                    >
                      {isPurchasing ? (
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingBag size={28} className="group-hover/btn:scale-110 transition-transform" /> 
                          Buy Now — ${product.price}
                        </>
                      )}
                    </button>
                  )}
                  
                  {showDownloadButton && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                      <button 
                        onClick={handleDownload}
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl transition-all shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-4 active:scale-95"
                      >
                        <Download size={28} /> 
                        Download Now
                      </button>
                      {product.category === 'Courses' && (
                        <Link 
                          to={`/course/${product.id}`}
                          className="w-full py-6 bg-slate-800 text-white font-black text-xl rounded-2xl transition-all flex items-center justify-center gap-4 border border-slate-700 hover:bg-slate-700 active:scale-95"
                        >
                          <Play size={28} className="fill-current" /> 
                          Launch Course
                        </Link>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 py-4">
                     <Lock size={12} className="text-slate-600" />
                     <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                       Secure encrypted checkout via NovaPay
                     </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-800 flex items-center gap-4 hover:border-slate-600 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Extension</p>
                  <p className="text-base font-bold text-white">{product.fileType}</p>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-800 flex items-center gap-4 hover:border-slate-600 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <HardDrive size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Bundle Size</p>
                  <p className="text-base font-bold text-white">{product.fileSize}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-16 border-t border-slate-800">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-white">Full Product Specifications</h2>
              <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed text-xl space-y-6">
                <p>{product.description}</p>
                <p>This industry-standard resource has been crafted for professionals who value efficiency without compromising on aesthetics. Each component of the {product.category.toLowerCase()} has been manually audited for production readiness.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {[
                    "Lossless quality files",
                    "Lifetime platform updates",
                    "Royalty-free licensing",
                    "Direct author support",
                    "Cross-software compatibility",
                    "Mobile-optimized access"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-bold bg-slate-800/20 p-4 rounded-2xl border border-slate-800/50">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/20">
                        <Check size={14} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {product.category === 'Courses' && product.modules && (
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-white">Learning Curriculum</h2>
                <div className="space-y-6">
                  {product.modules.map((module, idx) => (
                    <div key={module.id} className="border border-slate-800 rounded-[32px] overflow-hidden bg-slate-900/40">
                      <div className="px-8 py-5 bg-slate-800/60 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-lg font-black text-white">Phase {idx + 1}: {module.title}</h3>
                        <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-slate-500">{module.lessons.length} Modules</span>
                      </div>
                      <div className="divide-y divide-slate-800">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="px-8 py-5 flex justify-between items-center hover:bg-slate-800/40 transition-all group/lesson">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover/lesson:border-indigo-500/30 transition-all">
                                {isPurchased ? <Play size={18} className="text-indigo-400 group-hover/lesson:scale-110 transition-transform" /> : <Lock size={18} className="text-slate-600" />}
                              </div>
                              <span className="text-base font-bold text-slate-300 group-hover/lesson:text-white transition-colors">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-black tracking-widest">
                              <Clock size={14} />
                              {lesson.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="p-10 rounded-[48px] bg-slate-950 text-white space-y-8 border border-slate-800 relative overflow-hidden group">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/5 blur-3xl rounded-full transition-all group-hover:scale-110" />
              <h3 className="text-2xl font-black flex items-center gap-3">
                <Zap size={24} className="text-indigo-400 fill-current" /> Nova Promise
              </h3>
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="font-black text-indigo-400 uppercase tracking-widest text-[10px]">Instant Fulfillment</p>
                  <p className="font-bold text-lg">Download at the speed of thought.</p>
                  <p className="text-sm text-slate-400 leading-relaxed">No confirmation delays. Once the payment clears, the cloud starts syncing your files.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-black text-indigo-400 uppercase tracking-widest text-[10px]">Verified Creators</p>
                  <p className="font-bold text-lg">Curation is our core value.</p>
                  <p className="text-sm text-slate-400 leading-relaxed">Every asset is stress-tested in production environments before hitting our servers.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-black text-indigo-400 uppercase tracking-widest text-[10px]">Future Proof</p>
                  <p className="font-bold text-lg">Buy once, use forever.</p>
                  <p className="text-sm text-slate-400 leading-relaxed">Free updates for the life of the product. No hidden subscription fees for single assets.</p>
                </div>
              </div>
            </div>
            
            <div className="p-10 rounded-[48px] border-2 border-dashed border-slate-800 text-center space-y-6">
              <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
                <Copy size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white">Need Support?</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Our technical engineers and creators are available for integration help.</p>
              </div>
              <Link to="/p/contact" className="inline-block w-full py-4 bg-slate-800 rounded-2xl text-sm font-black hover:bg-slate-700 text-white transition-all hover:scale-[1.02]">
                Open Support Ticket
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-12 pt-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tighter">You Might Also <span className="text-indigo-400 underline decoration-indigo-500/30 underline-offset-8">Love</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Trending in {product.category}</p>
            </div>
            <Link to={`/marketplace?category=${product.category}`} className="text-indigo-400 font-black hover:underline underline-offset-4 flex items-center gap-2 text-sm">
              Explore All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <Link 
                key={p.id} 
                to={`/product/${p.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group relative flex flex-col bg-slate-800/40 rounded-[40px] overflow-hidden border border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={p.imageUrl} 
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-xl z-20 ${p.isFree ? 'bg-emerald-500/80 border-emerald-400' : 'bg-indigo-600/80 border-indigo-400'}`}>
                    {p.isFree ? 'FREE' : 'PAID'}
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/90 backdrop-blur-sm rounded-xl text-[8px] font-black uppercase tracking-widest text-white shadow-sm border border-slate-700 z-10">
                    {p.category}
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black line-clamp-1 text-white group-hover:text-indigo-400 transition-colors">{p.title}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Download size={12} /> {p.salesCount} downloads
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-5 border-t border-slate-800">
                    <span className="text-2xl font-black text-white">
                      {p.isFree ? 'FREE' : `$${p.price}`}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
