
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Leaderboard from "./Leaderboard";

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const IQTestApp = () => {
  const [step, setStep] = useState("intro");
  const [questionsData, setQuestionsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [name, setName] = useState("");
  const [score, setScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeLog, setTimeLog] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
console.log("Fetching questions...");
    fetch("https://iq-backend-bc3f.onrender.com/questions")
      .then((res) => res.json())
      .then((data) => {
        console.log("Received data:", data);
        console.log("Setting first question:", data[0]);
      });
  }, []);

  useEffect(() => {
    if (step !== "quiz") return;
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, currentIndex]);

  const handleStart = () => {
    console.log("Test started");
    setStep("quiz");
    setCurrentIndex(0);
    setQuestion(questionsData[0]);
    setScore(0);
    setSelectedAnswers([]);
    setTimeLog([]);
    setCategoryScores({});
    setElapsedTime(0);
  };

  const handleAnswer = (selectedOption) => {
    const currentQuestion = questionsData[currentIndex];
    const correct = selectedOption === currentQuestion.answer;
    const category = currentQuestion.category || "General";
    const explanation = currentQuestion.explanation || "";

    if (correct) {
      setScore((prev) => prev + 1);
      setCategoryScores((prev) => ({
        ...prev,
        [category]: (prev[category] || 0) + 1,
      }));
    }

    setSelectedAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: selectedOption,
        correct: currentQuestion.answer,
        explanation,
        time: elapsedTime,
      },
    ]);

    setTimeLog((prev) => [...prev, elapsedTime]);
    setElapsedTime(0);

    if (currentIndex + 1 < questionsData.length) {
      setCurrentIndex((prev) => prev + 1);
    console.log("Next question:", questionsData[currentIndex + 1]);
      setQuestion(questionsData[currentIndex + 1]);
    } else {
      setStep("result");
    }
  };

  const handleRetake = () => {
    setStep("intro");
    setCurrentIndex(0);
    setQuestion(null);
    setScore(0);
    setSelectedAnswers([]);
    setTimeLog([]);
    setElapsedTime(0);
    setCategoryScores({});
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
              className="bg-blue-600 text-white px-4 py-2 rounded"
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
            <p className="text-blue-500 mb-6">Time Spent: {elapsedTime} seconds</p>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-blue-700">Test Complete!</h2>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-left">
              <p className="text-xl mb-2"><strong>Name:</strong> {name}</p>
              <p className="text-xl mb-2"><strong>Score:</strong> {score} / {questionsData.length}</p>
              <p className="text-xl mb-2"><strong>Estimated IQ:</strong> {Math.round(80 + (score / questionsData.length) * 40)}</p>
              <p className="text-xl mb-4"><strong>Total Time Spent:</strong> {timeLog.reduce((a,b)=>a+b,0)} seconds</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6 text-left">
              <h3 className="text-2xl font-semibold mb-2">Category Breakdown</h3>
              <ul className="list-disc pl-6 space-y-1">
                {Object.entries(categoryScores).map(([cat, val]) => (
                  <li key={cat}>
                    <strong>{cat}:</strong> {val}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm text-left">
              <h3 className="text-2xl font-semibold mb-4">Answer Review</h3>
              {selectedAnswers.map((ans, index) => (
                <div key={index} className="mb-4 border-b pb-2">
                  <p><strong>Q{index + 1}:</strong> {ans.question}</p>
                  <p><span className="text-green-600">Correct:</span> {ans.correct}</p>
                  <p><span className="text-red-500">Your Answer:</span> {ans.selected}</p>
                  <p className="text-gray-700 text-sm italic">{ans.explanation}</p>
                  <p className="text-sm text-blue-500">Time Spent: {ans.time}s</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleRetake}>
                Retake Test
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowLeaderboard(true)}>
                View Leaderboard
              </button>
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setStep('intro')}>
                Home
              </button>
            </div>
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