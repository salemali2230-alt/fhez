
import React from 'react';
import type { Chapter } from '../types';
import { LightningBoltIcon } from './icons/Icons';

interface SidebarProps {
  chapters: Chapter[];
  selectedChapterId: number;
  setSelectedChapterId: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chapters, selectedChapterId, setSelectedChapterId }) => {
  return (
    <aside className="w-64 bg-slate-800/50 p-4 border-s border-slate-700/50 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <LightningBoltIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">مختبر الفيزياء</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => chapter.id < 2 && setSelectedChapterId(chapter.id)}
            disabled={chapter.id >= 2}
            className={`px-4 py-2 text-start rounded-lg transition-colors duration-200 ${
              selectedChapterId === chapter.id
                ? 'bg-indigo-600 text-white font-semibold shadow-lg'
                : 'text-slate-300 hover:bg-slate-700/50'
            } ${chapter.id >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {chapter.title}
          </button>
        ))}
      </nav>
      <div className="mt-auto text-center text-xs text-slate-500">
        <p>تصميم وتطوير بواسطة مهندس الواجهات الأمامية الخبير</p>
      </div>
    </aside>
  );
};

export default Sidebar;
