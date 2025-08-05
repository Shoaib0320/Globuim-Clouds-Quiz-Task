import React from 'react';
import { Star, Clock } from 'lucide-react';

const QuizCard = ({
  question,
  options,
  currentIndex,
  total,
  handleAnswer,
  showNext,
  isCorrect,
  selectedOption,
  handleNext,
  score,
  maxScore,
  timer,
}) => {
  const getStars = (difficulty) => {
    const stars = {
      easy: 1,
      medium: 2,
      hard: 3,
    }[difficulty] || 2;

    return (
      <div className="flex gap-1">
        {[...Array(stars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {[...Array(3 - stars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-gray-300" />
        ))}
      </div>
    );
  };

  const getOptionClass = (option) => {
    if (!showNext) return 'w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200 bg-white';

    const decoded = decodeURIComponent(option);
    const correct = decodeURIComponent(question?.correct_answer || '');

    if (decoded === correct) return 'w-full p-4 text-left border-2 border-green-500 rounded-lg bg-green-100 text-green-800';
    if (decoded === selectedOption) return 'w-full p-4 text-left border-2 border-red-500 rounded-lg bg-red-100 text-red-800';
    return 'w-full p-4 text-left border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500';
  };

  const progressWidth = ((currentIndex + 1) / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="w-full bg-gray-200 h-2">
        <div
          className="h-full bg-green-500 transition-all duration-300 ease-out"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      <div className="p-8">
        {/* Top Bar with Category and Timer */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-600 font-medium">
            Entertainment: Board Games
          </span>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{timer || '00:45'}</span>
          </div>
        </div>

        {/* Question Number and Stars */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Question {(currentIndex || 0) + 1} of {total || 20}
          </h2>
          {question?.difficulty && getStars(question.difficulty)}
        </div>

        {/* Question Text */}
        <h3 className="text-lg text-gray-800 mb-8 leading-relaxed select-none">
          {question ? decodeURIComponent(question.question) : 'At the start of a standard game of the Monopoly, if you throw a double six, which square would you land on?'}
        </h3>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {(options).map((option, index) => (
            <button
              key={index}
              className={getOptionClass(option)}
              onClick={() => !showNext && handleAnswer && handleAnswer(option)}
              disabled={showNext}
            >
              {decodeURIComponent(option)}
            </button>
          ))}
        </div>

        {showNext && (
          <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold mb-6 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : 'Wrong!'}
            </h3>
            <button
              className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={handleNext}
            >
              Next Question
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Score: {score || 0}%</span>
          <span className="text-sm text-gray-600">Max Score: {maxScore || 0}%</span>
        </div>

        {/* 🟩 Score Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div className="flex h-full">
            <div
              className="bg-green-400 h-full transition-all duration-300"
              style={{ width: `${score}%` }}
            />
            <div
              className="bg-yellow-400 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, maxScore - score)}%` }}
            />
            <div
              className="bg-gray-300 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, 100 - maxScore)}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizCard;