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
  const [timeLeft, setTimeLeft] = useState(30);

  const question = questionsData[currentIndex];

  const handleStart = () => {
    if (!name.trim()) return;
    setStep("quiz");
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === question.correct_answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCategoryScores(prev => ({
        ...prev,
        [question.category]: (prev[question.category] || 0) + 1
      }));
    }

    setSelectedAnswers(prev => [
      ...prev,
      {
        question: question.question,
        selected: answer,
        correct: question.correct_answer,
        category: question.category,
        explanation: question.explanation
      }
    ]);

    if (currentIndex + 1 < questionsData.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setStep("result");
    }
  };

  const handleRetake = () => {
    setStep("intro");
    setName("");
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswers([]);
    setCategoryScores({});
    setShowLeaderboard(false);
    setTimeLeft(30);
  };

  useEffect(() => {
    if (step !== "quiz") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer("No Answer");
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, currentIndex]);

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-center">
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-4">Welcome to the IQ Test</h1>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleStart}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Start Test
            </button>
            <div className="mt-4">
              <button
                onClick={() => setShowLeaderboard(true)}
                className="text-blue-500 underline"
              >
                View Leaderboard
              </button>
            </div>
            {showLeaderboard && (
              <div className="mt-6">
                <Leaderboard />
              </div>
            )}
          </motion.div>
        )}

        {step === "quiz" && (
          <motion.div
            key={`question-${currentIndex}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-2">Question {currentIndex + 1}</h2>
            <p className="mb-4">{question.question}</p>
            <p className="text-red-500 mb-6">Time left: {timeLeft} seconds</p>
            <div className="grid grid-cols-2 gap-4">
              {question.answers.map((ans, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(ans)}
                  className="bg-gray-200 hover:bg-gray-300 p-4 rounded"
                >
                  {ans}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            key="result"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Your Score: {score}/{questionsData.length}</h2>
            <p className="mb-2">Thank you, {name}!</p>

            <div className="text-left mt-6">
              <h3 className="text-xl font-semibold mb-2">Breakdown by Category:</h3>
              <ul className="mb-6">
                {Object.entries(categoryScores).map(([cat, val]) => (
                  <li key={cat}>{cat}: {val}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-2">Review Answers:</h3>
              <ul className="space-y-4">
                {selectedAnswers.map((item, idx) => (
                  <li key={idx} className="p-4 bg-gray-100 rounded">
                    <strong>Q{idx + 1}:</strong> {item.question}<br/>
                    <span className="text-green-700">Correct Answer:</span> {item.correct}<br/>
                    <span className="text-blue-700">Your Answer:</span> {item.selected}<br/>
                    <span className="text-gray-700 italic">Explanation:</span> {item.explanation}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <button
                onClick={handleRetake}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Retake Test
              </button>
              <button
                onClick={() => setShowLeaderboard(true)}
                className="text-blue-500 underline ml-4"
              >
                View Leaderboard
              </button>
            </div>

            {showLeaderboard && (
              <div className="mt-6">
                <Leaderboard />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IQTestApp;