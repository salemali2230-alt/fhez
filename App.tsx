
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChapterContent from './components/ChapterContent';
import { chapters } from './constants';
import type { Chapter } from './types';

const App: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);

  const selectedChapter = chapters.find(c => c.id === selectedChapterId) as Chapter;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200">
      <Sidebar 
        chapters={chapters} 
        selectedChapterId={selectedChapterId} 
        setSelectedChapterId={setSelectedChapterId} 
      />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {selectedChapter ? (
          <ChapterContent chapter={selectedChapter} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl text-slate-500">الرجاء اختيار فصل للبدء.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
