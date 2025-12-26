
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const StaticPage: React.FC = () => {
  const { slug } = useParams();

  const renderContent = () => {
    switch (slug) {
      case 'about':
        return (
          <div className="space-y-12">
            <h1 className="text-5xl font-black">Empowering Digital Creators</h1>
            <div className="aspect-video rounded-[40px] overflow-hidden bg-slate-200">
              <img src="https://picsum.photos/seed/about/1200/600" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-3xl space-y-6 text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>NovaMarket was founded in 2023 with a single mission: to provide a premium, seamless, and fair marketplace for digital artisans. We believe that great work deserves to be shared and creators deserve to be compensated fairly.</p>
              <p>From independent developers and photographers to online educators and graphic designers, we help over 50,000 creators worldwide turn their passion into a sustainable career.</p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h1 className="text-5xl font-black">Get in touch</h1>
              <p className="text-xl text-slate-500">Have questions about our platform? We're here to help you 24/7.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                    <Mail />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Email</p>
                    <p className="font-bold">support@novamarket.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                    <Phone />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Phone</p>
                    <p className="font-bold">+1 (555) 000-0000</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                    <MapPin />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Office</p>
                    <p className="font-bold">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border dark:border-slate-700 shadow-xl">
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Your Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Your Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border dark:border-slate-700" />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  Send Message <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        );
      default:
        return (
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="text-4xl font-black capitalize">{slug?.replace('-', ' ')}</h1>
            <p className="text-lg text-slate-500 mt-4">Last updated: Oct 2023</p>
            <div className="mt-8 space-y-6">
              <h3 className="text-2xl font-bold">1. Introduction</h3>
              <p>Welcome to NovaMarket. These terms and conditions outline the rules and regulations for the use of NovaMarket's Website.</p>
              <h3 className="text-2xl font-bold">2. Digital Downloads</h3>
              <p>By purchasing a digital product, you are granted a non-exclusive license to use the materials. Unauthorized distribution or resale is strictly prohibited.</p>
              <h3 className="text-2xl font-bold">3. Refunds</h3>
              <p>Due to the nature of digital goods, all sales are final. Refunds may only be granted in exceptional circumstances at the author's discretion.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {renderContent()}
    </div>
  );
};

export default StaticPage;
