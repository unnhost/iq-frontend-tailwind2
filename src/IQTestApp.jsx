
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://iq-backend-bc3f.onrender.com";

export default function IQTestApp({ userName }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sent, setSent] = useState(false); // track if result already sent

  useEffect(() => {
    fetch(`${API_URL}/questions`)
      .then((res) => res.json())
      .then(setQuestions)
      .catch((err) => console.error("Error loading questions:", err));
  }, []);

  useEffect(() => {
    if (submitted && !sent) {
      const totalCorrect = answers.filter((a) => a.isCorrect).length;
      const iqEstimate = 80 + Math.round((totalCorrect / questions.length) * 40);
      fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          score: totalCorrect,
          max_score: questions.length,
          iq: iqEstimate,
          results: answers,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Submitted result:", data))
        .catch((err) => console.error("Submit error:", err));

      setSent(true);
    }
  }, [submitted, sent, answers, questions, userName]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    fetch(`${API_URL}/questions`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load questions");
        return res.json();
      })
      .then(setQuestions)
      .catch((err) => {
        console.error("Error loading questions:", err);
      });
  }, []);

  useEffect(() => {
    if (submitted || current >= questions.length || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, current, submitted, questions]);

  const handleAnswer = (selected) => {
    const q = questions[current];
    const correctAnswer = String(q.answer).trim().toLowerCase();
    const userAnswer = String(selected).trim().toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    const newAnswer = {
      question: q.question,
      correctAnswer: q.answer,
      selected: selected,
      isCorrect,
      time: 30 - timeLeft,
      category: q.category,
    };

    setAnswers((prev) => [...prev, newAnswer]);

    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setTimeLeft(30);
    } else {
      setSubmitted(true);
    }
  };

  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const iqEstimate = 80 + Math.round((totalCorrect / totalQuestions) * 40);

  const summaryByCategory = () => {
    const stats = {};
    for (const ans of answers) {
      if (!stats[ans.category]) stats[ans.category] = { correct: 0, total: 0 };
      stats[ans.category].total += 1;
      if (ans.isCorrect) stats[ans.category].correct += 1;
    }

    return Object.entries(stats).map(([cat, stat]) => (
      <li key={cat}>
        <strong>{cat}</strong>: {stat.correct} / {stat.total}{" "}
        {stat.correct / stat.total < 0.5 ? "❌ Needs improvement" : "✅"}
      </li>
    ));
  };

  const renderSummary = () =>
    answers.map((a, i) => (
      <li key={i}>
        Q{i + 1}: {a.question} | Your Answer: <strong>{a.selected}</strong> | Correct Answer: <strong>{a.correctAnswer}</strong> |{" "}
        {a.isCorrect ? "✅ Correct" : "❌ Incorrect"} | Time: <strong>{a.time}s</strong>
      </li>
    ));

  if (questions.length === 0) {
    return <p className="p-6 text-center text-lg">Loading questions...</p>;
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <h2 className="text-2xl font-bold mb-4">Results</h2>
        <p className="text-xl mb-2">🎉 Hey <strong>{userName}</strong>!</p>
        <p className="text-xl mb-4">
          Your score is <strong>{totalCorrect} / {totalQuestions}</strong> and your estimated IQ is <strong>{iqEstimate}</strong> 🧠
        </p>
        <h3 className="text-lg font-semibold mb-2">Answer Summary:</h3>
        <ul className="mb-4">{renderSummary()}</ul>
        <h3 className="text-lg font-semibold mt-4 mb-2">Category Breakdown:</h3>
        <ul className="mb-6">{summaryByCategory()}</ul>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retake Test
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            🏠 Home
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center min-h-screen bg-white p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Question {current + 1}</h2>
        <p className="mb-4 text-lg">{q.question}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="bg-blue-100 hover:bg-blue-300 text-black font-medium px-4 py-2 rounded-lg transition duration-150"
            >
              {opt}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">Time left: {timeLeft}s</p>
      </motion.div>
    </AnimatePresence>
  );
}