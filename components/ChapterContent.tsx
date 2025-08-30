
import React, { useState } from 'react';
import type { Chapter, TabKey } from '../types';
import { BookOpenIcon, BeakerIcon, PuzzleIcon } from './icons/Icons';
import ExplanationSection from './ExplanationSection';
import ExperimentsSection from './ExperimentsSection';
import GamesSection from './GamesSection';

interface ChapterContentProps {
  chapter: Chapter;
}

const ChapterContent: React.FC<ChapterContentProps> = ({ chapter }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('explanation');

  const tabs = [
    { key: 'explanation', label: 'الشرح', icon: <BookOpenIcon className="w-5 h-5" /> },
    { key: 'experiments', label: 'التجارب', icon: <BeakerIcon className="w-5 h-5" /> },
    { key: 'games', label: 'ألعاب ومسابقات', icon: <PuzzleIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-white mb-4 pb-4 border-b-2 border-slate-700">{chapter.title}</h2>
      
      <div className="flex items-center gap-2 border-b border-slate-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabKey)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors duration-200 border-b-2 ${
              activeTab === tab.key
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'explanation' && <ExplanationSection content={chapter.explanation} />}
        {activeTab === 'experiments' && <ExperimentsSection experiments={chapter.experiments} />}
        {activeTab === 'games' && <GamesSection quiz={chapter.games.quiz} />}
      </div>
    </div>
  );
};

export default ChapterContent;
