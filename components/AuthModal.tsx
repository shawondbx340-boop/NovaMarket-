import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ShieldAlert, 
  Zap, 
  Check, 
  Shield, 
  Lock, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { User } from '../types';
import { supabase, getRedirectUrl } from '../supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  setUser: (user: User) => void;
}

const DiscordIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0-1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, setUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDiscordLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: getRedirectUrl()
        }
      });
      if (error) throw error;
    } catch (e: any) {
      alert(e.message || "Failed to initiate Discord Auth.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl overflow-y-auto">
      <div className="bg-slate-900 border border-white/5 w-full max-w-6xl min-h-[640px] rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-500 my-auto flex flex-col lg:flex-row ring-1 ring-white/10 relative">
        
        {/* Cinematic Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 overflow-hidden">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 blur-[130px] rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Left Branding Pane */}
        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-white/5 bg-slate-900/40">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 backdrop-blur-md">
              <Sparkles size={14} />
              Nova Platform
            </div>
            
            <div className="space-y-4">
              <h2 className="text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter">
                Welcome <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-600">Back</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium max-w-sm leading-relaxed">
                Sign in to unlock premium resources, join our creative community, and elevate your projects.
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-12">
            {[
              { text: "2878+ Premium Resources", icon: <Check size={18} /> },
              { text: "Secure OAuth Authentication", icon: <Shield size={18} /> },
              { text: "Instant Access After Login", icon: <Zap size={18} /> },
              { text: "Join 2,328+ Active Users", icon: <Sparkles size={18} /> }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <span className="text-slate-300 font-bold tracking-tight text-sm uppercase tracking-widest">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Interaction Pane */}
        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center items-center text-center relative z-10">
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-500 rounded-2xl transition-all border border-white/5"
          >
            <X size={24} />
          </button>

          <div className="w-full max-w-sm space-y-12">
            <div className="space-y-3">
              <h3 className="text-4xl font-black text-white tracking-tight">Sign In</h3>
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Access Secure Node</p>
            </div>

            <button 
              onClick={handleDiscordLogin}
              disabled={isLoading}
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-4 shadow-2xl shadow-indigo-600/20 group active:scale-[0.98] ring-1 ring-white/10"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <DiscordIcon />
                  <span>Continue with Discord</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="space-y-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-900 px-4 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
                    Secure Authentication
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {[
                  { icon: <Shield size={18} />, label: "Encrypted" },
                  { icon: <Lock size={18} />, label: "Private" },
                  { icon: <Zap size={18} />, label: "Fast" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-24 py-5 rounded-3xl bg-slate-800/50 border border-white/5 hover:border-indigo-500/30 transition-all group">
                    <div className="text-indigo-400 group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-4">
                <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                  By accessing NovaMarket, you agree to our <br />
                  <span className="text-indigo-400 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-indigo-400 cursor-pointer hover:underline">Privacy Policy</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;