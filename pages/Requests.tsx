import React, { useState, useEffect } from 'react';
import { Plus, ThumbsUp, X } from 'lucide-react';
import { ProductRequest } from '../types';

const Requests: React.FC = () => {
  const [requests, setRequests] = useState<ProductRequest[]>(() => {
    try {
        const saved = localStorage.getItem('nova_requests');
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error("Storage read error in Requests", e);
    }
    // Return empty array instead of demo data
    return [];
  });

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
  }, [requests]);

  useEffect(() => {
    try {
        localStorage.setItem('nova_requests', JSON.stringify(requests));
    } catch (e) {}
  }, [requests]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', category: 'Graphics' });

  const handleVote = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request: ProductRequest = {
      ...newRequest,
      id: Math.random().toString(36).substr(2, 9),
      votes: 0,
      userName: 'Guest User',
      date: 'Just now',
      status: 'pending'
    };
    setRequests([request, ...requests]);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 space-y-12">
      <div className="text-center space-y-4 reveal-init">
        <h1 className="text-5xl font-black tracking-tight text-white">Community <span className="text-indigo-400">Inquiries</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Need specific assets? Let our verified creators know what to build next.
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-xl shadow-indigo-500/20 flex items-center gap-2 mx-auto"
        >
          <Plus size={20} /> Request Resource
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.length > 0 ? requests.map((request, i) => (
          <div 
            key={request.id} 
            className="reveal-init bg-slate-800/40 border border-slate-800 p-8 rounded-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-indigo-500/30 transition-all group"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="space-y-3 flex-grow">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg">{request.category}</span>
                <span className="text-slate-500 text-xs">{request.date} • by {request.userName}</span>
                {request.status !== 'pending' && (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${request.status === 'fulfilled' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {request.status}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{request.title}</h3>
              <p className="text-slate-400 line-clamp-2 leading-relaxed">{request.description}</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/50 p-5 rounded-3xl border border-slate-700/50">
              <div className="text-center min-w-[50px]">
                <p className="text-2xl font-black text-white leading-none">{request.votes}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Votes</p>
              </div>
              <button 
                onClick={() => handleVote(request.id)}
                className="w-14 h-14 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-xl"
              >
                <ThumbsUp size={24} />
              </button>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-slate-700 font-black uppercase tracking-widest">
            No community inquiries found
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[48px] shadow-2xl p-10 animate-in zoom-in duration-300 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white"><X /></button>
            <h2 className="text-3xl font-black mb-8 text-white">New Request</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Title</label>
                <input required placeholder="e.g., Cyberpunk Character Pack" className="w-full px-6 py-5 bg-slate-800/40 border border-slate-700 rounded-3xl outline-none focus:border-indigo-500 font-bold" value={newRequest.title} onChange={e => setNewRequest({...newRequest, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                <select className="w-full px-6 py-5 bg-slate-800/40 border border-slate-700 rounded-3xl outline-none focus:border-indigo-500 font-bold" value={newRequest.category} onChange={e => setNewRequest({...newRequest, category: e.target.value})}>
                  <option>Graphics</option>
                  <option>Courses</option>
                  <option>Video Assets</option>
                  <option>Development</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Requirements</label>
                <textarea required rows={4} placeholder="Tell creators exactly what you need..." className="w-full px-6 py-5 bg-slate-800/40 border border-slate-700 rounded-3xl outline-none focus:border-indigo-500 font-bold resize-none" value={newRequest.description} onChange={e => setNewRequest({...newRequest, description: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black text-xl rounded-3xl hover:bg-indigo-700 shadow-2xl active:scale-95 transition-all">Submit to Creators</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;