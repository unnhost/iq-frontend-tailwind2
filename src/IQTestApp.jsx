
import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import Leaderboard from "./Leaderboard";
import { motion, AnimatePresence } from "framer-motion";

const IQTestApp = () => {
  const [step, setStep] = useState("intro");
  const [name, setName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [categoryScores, setCategoryScores] = useState({});
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeLog, setTimeLog] = useState([]);

  const question = questionsData[currentIndex];

  useEffect(() => {
    let timer;
    if (step === "quiz") {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, currentIndex]);

  const handleStart = () => {
    if (!name.trim()) return;
    setStep("quiz");
  };

  const calculateSpeedBonus = (time) => {
    if (time <= 3) return 1.0;
    if (time >= 15) return 0.0;
    return ((15 - time) / 12).toFixed(2);
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === question.correct_answer;
    const timeTaken = elapsedTime;
    setElapsedTime(0);
    setTimeLog(prev => [...prev, timeTaken]);

    if (isCorrect) {
      const basePoints = 1;
      const speedBonus = parseFloat(calculateSpeedBonus(timeTaken));
      const totalPoints = basePoints + speedBonus;
      setScore(prev => prev + totalPoints);
      setCategoryScores(prev => ({
        ...prev,
        [question.category]: (prev[question.category] || 0) + totalPoints,
      }));
    }

    setSelectedAnswers(prev => [...prev, { question: question.question, selected: answer, correct: question.correct_answer, time: timeTaken }]);

    if (currentIndex + 1 < questionsData.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStep("result");
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswers([]);
    setCategoryScores({});
    setElapsedTime(0);
    setTimeLog([]);
    setStep("quiz");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <AnimatePresence>
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-3xl font-bold mb-4">Welcome to the IQ Test</h1>
            <input
              type="text"
              placeholder="Enter your name"
              className="border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
              onClick={handleStart}
            >
              Start Test
            </button>
          </motion.div>
        )}

        {step === "quiz" && question && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-2">{question.question}</h2>
            <div className="mb-4">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="block w-full bg-gray-200 hover:bg-gray-300 rounded p-2 my-2"
                >
                  {option}
                </button>
              ))}
            </div>
            <p>Time: {elapsedTime}s</p>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Test Complete!</h2>
            <p className="mb-2">Score: {score.toFixed(2)}</p>
            <p className="mb-4">Name: {name}</p>
            <div className="text-left mb-4">
              <h3 className="text-lg font-semibold">Category Breakdown:</h3>
              <ul className="list-disc pl-6">
                {Object.entries(categoryScores).map(([cat, val]) => (
                  <li key={cat}>
                    {cat}: {val.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleRetake}
            >
              Retake Test
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setShowLeaderboard(true)}
            >
              View Leaderboard
            </button>
          </motion.div>
        )}

        {showLeaderboard && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Leaderboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IQTestApp;
