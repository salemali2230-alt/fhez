
import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../types.ts';

interface GamesSectionProps {
  quiz: QuizQuestion[];
}

const GamesSection: React.FC<GamesSectionProps> = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswerIndex;

  useEffect(() => {
    // Reset state when quiz data changes
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsFinished(false);
  }, [quiz]);


  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    if (answerIndex === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsFinished(false);
  };
  
  if(isFinished) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-lg animate-fade-in text-center">
        <h3 className="text-3xl font-bold text-white">انتهى الاختبار!</h3>
        <p className="text-xl text-slate-300 mt-4">
          نتيجتك النهائية هي: <span className="font-bold text-indigo-400">{score}</span> من <span className="font-bold">{quiz.length}</span>
        </p>
         <div className="w-full bg-slate-700 rounded-full h-4 mt-4 overflow-hidden">
            <div 
              className="bg-indigo-600 h-4 rounded-full transition-all duration-500" 
              style={{width: `${percentage}%`}}
            ></div>
        </div>
        <p className="text-2xl font-bold mt-2" style={{color: percentage > 60 ? '#34D399' : '#F87171'}}>{percentage}%</p>
        <button onClick={restartQuiz} className="mt-8 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
          إعادة الاختبار
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <p>لا توجد أسئلة متاحة.</p>;
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-800/50 rounded-lg border border-slate-700 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-indigo-400">سؤال {currentQuestionIndex + 1} / {quiz.length}</h3>
            <p className="font-bold text-white">النتيجة: {score}</p>
        </div>
      <h4 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          let buttonClass = 'bg-slate-700 hover:bg-slate-600';
          if (showFeedback && isSelected) {
            buttonClass = isCorrect ? 'bg-green-500' : 'bg-red-500';
          } else if (showFeedback && index === currentQuestion.correctAnswerIndex) {
            buttonClass = 'bg-green-500';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={`p-4 rounded-lg text-start font-medium transition-all duration-200 text-white ${buttonClass} ${!showFeedback ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <div className="mt-6 text-center">
          <p className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة!'}
          </p>
          <button onClick={handleNext} className="mt-4 px-8 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            {currentQuestionIndex < quiz.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GamesSection;