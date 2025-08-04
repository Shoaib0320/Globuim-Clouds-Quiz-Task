// App.jsx
import React, { useState, useEffect } from 'react';
import QuizCard from './components/QuizCard';
import questions from './data/question';
import './index.css';

const App = () => {
  const total = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!isFinished) {
      const allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
      const shuffled = allOptions.sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
      setTimer(60);
    }
  }, [currentIndex, isFinished]);

  useEffect(() => {
    if (showNext || isFinished) return;
    if (timer === 0) {
      handleAnswer(null);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, showNext, isFinished]);

  const handleAnswer = (option) => {
    const correct = decodeURIComponent(currentQuestion.correct_answer);
    const selected = option ? decodeURIComponent(option) : '';
    const answerIsCorrect = selected === correct;

    if (answerIsCorrect) setCorrectCount((c) => c + 1);
    setSelectedOption(selected);
    setIsCorrect(answerIsCorrect);
    setAttempts((a) => a + 1);
    setShowNext(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < total) {
      setCurrentIndex((i) => i + 1);
      setShowNext(false);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setAttempts(0);
    setSelectedOption(null);
    setIsCorrect(false);
    setShowNext(false);
    setIsFinished(false);
    setTimer(60);
  };

  const score = attempts ? Math.round((correctCount / attempts) * 100) : 0;
  const maxScore = Math.round(((correctCount + (total - attempts)) / total) * 100);
  const minScore = Math.round((correctCount / total) * 100);

  return (
    <div className="app">
      {isFinished ? (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Finished!</h2>
          <p className="text-xl text-gray-700 mb-6">You scored {correctCount} out of {total}</p>
          <p className="text-lg text-gray-600 mb-6">Final Score: {score}%</p>
          <button
            onClick={handleRestart}
            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <QuizCard
          question={currentQuestion}
          options={shuffledOptions}
          currentIndex={currentIndex}
          total={total}
          handleAnswer={handleAnswer}
          handleNext={handleNext}
          showNext={showNext}
          isCorrect={isCorrect}
          selectedOption={selectedOption}
          score={score}
          maxScore={maxScore}
          minScore={minScore}
          timer={timer}
        />
      )}
    </div>
  );
};

export default App;