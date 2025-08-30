import React, { useState, useMemo } from 'react';
import type { ExplanationContent } from '../types';

interface ExplanationSectionProps {
  content: ExplanationContent[];
}

const ExplanationSection: React.FC<ExplanationSectionProps> = ({ content }) => {
  const slides = useMemo(() => {
    if (!content || content.length === 0) return [];

    const groupedSlides: ExplanationContent[][] = [];
    let currentSlide: ExplanationContent[] = [];

    content.forEach(item => {
      if (item.type === 'heading') {
        if (currentSlide.length > 0) {
          groupedSlides.push(currentSlide);
        }
        currentSlide = [item];
      } else {
        currentSlide.push(item);
      }
    });

    if (currentSlide.length > 0) {
      groupedSlides.push(currentSlide);
    }

    return groupedSlides;
  }, [content]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  if (slides.length === 0) {
    return <p className="text-center text-slate-400">لا يوجد محتوى شرح متاح لهذا الفصل.</p>;
  }

  const renderContentItem = (item: ExplanationContent, index: number) => {
    switch (item.type) {
      case 'heading':
        return <h3 key={index} className="text-2xl font-bold text-indigo-400 mt-6 border-b border-slate-700 pb-2">{item.content}</h3>;
      case 'paragraph':
        return <p key={index} className="text-slate-300 leading-relaxed text-lg">{item.content}</p>;
      case 'image':
        return <img key={index} src={item.content as string} alt="توضيح فيزيائي" className="rounded-lg shadow-xl mx-auto my-4 w-full max-w-xl" />;
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 text-slate-300 text-lg">
            {(item.content as string[]).map((listItem, i) => (
              <li key={i}>{listItem}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div key={currentSlideIndex} className="space-y-6 animate-fade-in flex-1">
        {slides[currentSlideIndex].map(renderContentItem)}
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700">
        <button
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          السابق
        </button>
        <span className="text-slate-400 font-semibold">
          {currentSlideIndex + 1} / {slides.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentSlideIndex === slides.length - 1}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default ExplanationSection;
