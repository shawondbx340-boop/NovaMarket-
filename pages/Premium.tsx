import React, { useEffect } from 'react';
import { Check, Crown, Zap, Shield, Users, ArrowRight } from 'lucide-react';

const Premium: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('reveal-active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-init').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-24 space-y-40 pb-40">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-10 reveal-init">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-card text-indigo-400 text-xs font-black uppercase tracking-[0.2em] border border-white/5">
          <Crown size={16} /> Elite Membership
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9]">
          The Novarian <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Elite Advantage</span>
        </h1>
        <p className="text-slate-400 text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
          Join the inner circle. Get exclusive access to premium high-fidelity assets, zero platform fees, and pro-grade tools.
        </p>
      </section>

      {/* Perks Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { icon: <Zap />, title: "Zero Service Fees", desc: "Novarian Elite members pay exactly the price listed. We waive all platform service fees.", delay: 'delay-100' },
          { icon: <Shield />, title: "Elite Vault Access", desc: "Unlock a secret archive of 4K assets and masterclasses only available to Pro users.", delay: 'delay-200' },
          { icon: <Users />, title: "VIP Engineering", desc: "Priority support directly from our technical team and asset creators 24/7.", delay: 'delay-300' }
        ].map((perk, i) => (
          <div key={i} className={`reveal-init ${perk.delay} p-12 rounded-[56px] glass-card space-y-8 hover:-translate-y-2 transition-all border border-white/5`}>
            <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center ring-1 ring-white/10">
              {perk.icon}
            </div>
            <h3 className="text-3xl font-black">{perk.title}</h3>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">{perk.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 space-y-16 reveal-init">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black tracking-tight">Simple Membership</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Tiered access for every ambition</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Pro */}
          <div className="p-14 rounded-[64px] glass-card space-y-12 relative overflow-hidden group border border-white/5 hover:border-indigo-500/20 transition-all">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Pro Novarian</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-white">$29</span>
                <span className="text-slate-600 font-black uppercase tracking-widest text-sm">/ mo</span>
              </div>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">Perfect for independent digital artists and specialized freelancers.</p>
            </div>
            <ul className="space-y-5">
              {['Unlimited 4K Downloads', 'Early Vault Access', '0% Marketplace Fees', 'Discord Pro Identity', 'Cloud Sync Vault'].map((item) => (
                <li key={item} className="flex items-center gap-4 text-sm font-black text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20"><Check size={14} /></div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-6 bg-white text-slate-950 font-black text-xl rounded-3xl hover:scale-105 transition-all active:scale-95 shadow-2xl">Join Pro</button>
          </div>

          {/* Enterprise */}
          <div className="p-14 rounded-[64px] bg-indigo-600 space-y-12 relative overflow-hidden shadow-2xl shadow-indigo-500/20 group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">Agency Enterprise</h3>
                <span className="px-4 py-1.5 bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">Elite Choice</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-white">$99</span>
                <span className="text-indigo-200 font-black uppercase tracking-widest text-sm">/ mo</span>
              </div>
              <p className="text-indigo-100 text-lg font-medium leading-relaxed">The complete infrastructure for agencies and heavy production houses.</p>
            </div>
            <ul className="space-y-5 text-white">
              {['Unlimited Team Members', 'Global Usage Rights', 'Custom Inquiry Priority', 'Private API Console', 'Dedicated Account Lead'].map((item) => (
                <li key={item} className="flex items-center gap-4 text-sm font-black">
                  <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center"><Check size={14} /></div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-6 bg-white text-indigo-600 font-black text-xl rounded-3xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95">
              Go Enterprise <ArrowRight size={28} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Premium;