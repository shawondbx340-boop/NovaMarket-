
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
import { supabase, isSupabaseConfigured } from '../supabase';

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

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
    }
  }, [product]);

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

  const handlePurchase = async () => {
    if (!user) {
      alert("Please login to purchase products.");
      return;
    }

    setIsPurchasing(true);
    
    try {
      if (isSupabaseConfigured) {
        const { error: orderError } = await supabase.from('orders').insert({
          user_id: user.id,
          product_id: product.id,
          amount: product.price,
          status: 'completed'
        });

        if (orderError) throw orderError;

        const newPurchasedIds = [...user.purchasedIds, product.id];
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ purchased_ids: newPurchasedIds })
          .eq('id', user.id);

        if (profileError) throw profileError;

        await supabase.rpc('increment_sales_count', { row_id: product.id });

        setUser({ ...user, purchasedIds: newPurchasedIds });
      } else {
        await new Promise(r => setTimeout(r, 1500));
        setUser({ ...user, purchasedIds: [...user.purchasedIds, product.id] });
      }
      
      setShowSuccess(true);
    } catch (e: any) {
      alert("Purchase failed: " + e.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDownload = () => {
    if (!product.fileUrl || product.fileUrl === '#') {
      alert("Error: Download link is not configured.");
      return;
    }
    const link = document.createElement('a');
    link.href = product.fileUrl; 
    link.download = `${product.title.replace(/\s+/g, '_')}_NovaMarket.${product.fileType.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="space-y-8">
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl bg-slate-800 aspect-video group border border-slate-800">
              <img 
                src={activeImage || product.imageUrl} 
                alt={product.title} 
                className="w-full h-full object-cover transition-all duration-700"
              />
              {/* Dynamic Badge */}
              {product.badgeText && (
                <div className={`absolute top-6 left-6 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border shadow-2xl backdrop-blur-md z-20 ${product.isFree ? 'bg-emerald-500/80 border-emerald-400 text-white' : 'bg-indigo-600/80 border-indigo-400 text-white'}`}>
                  {product.badgeText}
                </div>
              )}
              <div className="absolute bottom-6 left-6 px-5 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-700 z-10">
                {product.category}
              </div>
            </div>
            
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
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current Price</p>
                  <p className="text-5xl font-black text-white">
                    {product.isFree ? 'FREE' : `$${product.price}`}
                  </p>
                </div>
              </div>

              {showSuccess ? (
                <div className="p-8 bg-green-950/20 border border-green-800/50 rounded-[32px] flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-xl font-bold">Successfully Added to Library!</h3>
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
                        <><ShoppingBag size={28} /> Buy Now — ${product.price}</>
                      )}
                    </button>
                  )}
                  
                  {showDownloadButton && (
                    <div className="space-y-4">
                      <button 
                        onClick={handleDownload}
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl transition-all shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-4 active:scale-95"
                      >
                        <Download size={28} /> Download Now
                      </button>
                      {product.category === 'Courses' && (
                        <Link to={`/course/${product.id}`} className="w-full py-6 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-white font-black text-xl rounded-2xl transition-all flex items-center justify-center gap-4 active:scale-95">
                          <Play size={28} className="fill-current" /> Start Course
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
