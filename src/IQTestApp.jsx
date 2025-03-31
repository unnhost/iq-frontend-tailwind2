import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import Leaderboard from "./Leaderboard";

const IQTestApp = () => {
  const [step, setStep] = useState("intro"); // intro, quiz, result
  const [name, setName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const question = questionsData[currentIndex];

  const handleStart = () => {
    if (!name.trim()) return;
    setStep("quiz");
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === question.correct_answer;
    if (isCorrect) setScore(score + 1);

    const newAnswers = [...selectedAnswers, { question: question.question, selected: answer }];
    setSelectedAnswers(newAnswers);

    if (currentIndex + 1 < questionsData.length) {
      setCurrentIndex(currentIndex + 1);
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
    setShowLeaderboard(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-center">
      {step === "intro" && (
        <>
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
        </>
      )}

      {step === "quiz" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Question {currentIndex + 1}</h2>
          <p className="mb-6">{question.question}</p>
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
        </>
      )}

      {step === "result" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Your Score: {score}/{questionsData.length}</h2>
          <p className="mb-4">Thank you for completing the test, {name}!</p>
          <button
            onClick={handleRetake}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Retake Test
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
        </>
      )}
    </div>
  );
};

export default IQTestApp;