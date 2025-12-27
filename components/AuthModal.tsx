import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldAlert, Zap, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  setUser: (user: User) => void;
}

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, setUser }) => {
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDiscordLogin = async () => {
    if (!isSupabaseConfigured) {
      alert("Database keys are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment to enable real Discord OAuth.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (e: any) {
      alert(e.message || "Failed to initiate Discord Auth. Ensure your Supabase project has Discord Auth enabled.");
      setIsLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === 'NOVA-ADMIN-2025') {
      const adminUser: User = {
        id: 'admin-console-001',
        email: 'admin@nova.com',
        name: 'System Admin',
        role: 'admin',
        purchasedIds: []
      };
      setUser(adminUser);
      onClose();
      navigate('/admin');
    } else {
      alert("Invalid Administrative Access Key.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="bg-slate-900 border border-white/5 w-full max-sm rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black tracking-tighter text-white">
              {isAdminMode ? 'Admin Portal' : 'Sign In'}
            </h2>
            <button onClick={onClose} className="p-2 bg-slate-800 border border-white/5 hover:text-indigo-400 rounded-xl transition-all">
              <X size={18} />
            </button>
          </div>

          {!isAdminMode ? (
            <div className="space-y-6">
              {!isSupabaseConfigured && (
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider leading-relaxed">
                    Real Discord Auth requires Supabase configuration.
                  </p>
                </div>
              )}
              
              <p className="text-slate-500 font-bold text-sm leading-relaxed text-center">Join our verified creator ecosystem via Discord OAuth.</p>
              
              <button 
                onClick={handleDiscordLogin}
                disabled={isLoading}
                className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-lg shadow-[#5865F2]/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <DiscordIcon />
                    Login with Discord
                  </>
                )}
              </button>
              
              <div className="pt-2 flex justify-center">
                 <button 
                   onClick={() => setIsAdminMode(true)}
                   className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-indigo-400 transition-colors"
                 >
                   Administrative Access
                 </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-5 animate-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Staff Access Key</label>
                <input
                  type="password"
                  placeholder="Console Key"
                  required
                  autoFocus
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-800 border-2 border-slate-800 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white font-mono text-sm"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <ShieldAlert size={18} /> Enter Console
              </button>
              <button 
                type="button"
                onClick={() => setIsAdminMode(false)}
                className="w-full text-slate-500 text-xs font-bold hover:text-white transition-colors"
              >
                Return to Member Login
              </button>
            </form>
          )}

          <div className="text-center">
            <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.2em]">
              <Zap size={10} className="inline mr-1" /> Vercel & Supabase Secured
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;