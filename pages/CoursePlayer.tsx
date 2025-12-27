
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Play, ChevronLeft, CheckCircle, Lock, Menu, X, Clock, FileText } from 'lucide-react';
import { Product, User, Lesson } from '../types';

interface CoursePlayerProps {
  products: Product[];
  user: User | null;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ products, user }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(
    product?.modules?.[0]?.lessons?.[0] || null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!product || !user || (!user.purchasedIds.includes(product.id) && user.role !== 'admin')) {
    return <Navigate to={`/product/${id}`} replace />;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar Curriculum */}
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white dark:bg-slate-800 border-r dark:border-slate-700 overflow-y-auto flex-shrink-0 relative`}>
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-bold">Curriculum</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1">
            <X size={20} />
          </button>
        </div>
        <div className="divide-y dark:divide-slate-700">
          {product.modules?.map((module, mIdx) => (
            <div key={module.id} className="space-y-1">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 text-xs font-black text-slate-400 uppercase tracking-widest">
                Module {mIdx + 1}: {module.title}
              </div>
              <div className="space-y-1">
                {module.lessons.map((lesson) => (
                  <button 
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors ${currentLesson?.id === lesson.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                      <Play size={10} className={currentLesson?.id === lesson.id ? 'fill-current' : ''} />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-sm font-bold truncate">{lesson.title}</p>
                      <p className="text-[10px] text-slate-400">{lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Player */}
      <main className="flex-grow bg-slate-950 flex flex-col relative overflow-y-auto">
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-20 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Video Area */}
        <div className="flex-grow flex items-center justify-center p-4 lg:p-12">
          {currentLesson ? (
            <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
              <video 
                key={currentLesson.id}
                controls 
                className="w-full h-full object-contain"
                poster={product.imageUrl}
              >
                <source src={currentLesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="text-white text-center space-y-4">
              <Play size={64} className="mx-auto text-slate-700" />
              <p className="text-xl font-bold">Select a lesson to start learning</p>
            </div>
          )}
        </div>

        {/* Lesson Info */}
        {currentLesson && (
          <div className="bg-white dark:bg-slate-900 p-8 border-t dark:border-slate-800 space-y-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                <div className="flex gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1"><Clock size={16} /> {currentLesson.duration}</span>
                  <span className="flex items-center gap-1"><FileText size={16} /> Course Materials</span>
                </div>
                <div className="prose dark:prose-invert max-w-none text-slate-400">
                  <p>In this lesson, you will learn the fundamental concepts of {currentLesson.title.toLowerCase()} and how they apply to the overall project workflow. We will cover technical setups, common pitfalls, and best practices.</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/30">
                  Complete & Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursePlayer;