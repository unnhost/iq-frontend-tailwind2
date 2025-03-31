
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUPABASE_URL = "https://gsffsoqpuovvehvrkzos.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzZmZzb3FwdW92dmVodnJrem9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDcyNzQsImV4cCI6MjA1OTAyMzI3NH0.lJvQLG7AGfh4jFELn8529yXnXnYepKEDh8A3kqBBqKE";

export default function IQTestApp({ userName }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sent, setSent] = useState(false);

  
useEffect(() => {
  if (!submitted && timeLeft > 0) {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  } else if (timeLeft === 0 && !submitted) {
    handleAnswer("⏰ Timeout");
  }
}, [timeLeft, submitted]);

useEffect(() => {
    fetch("https://iq-backend-bc3f.onrender.com/questions")
      .then((res) => res.json())
      .then(setQuestions)
      .catch((err) => console.error("Error loading questions:", err));
  }, []);

  useEffect(() => {
    if (submitted && !sent) {
      const totalCorrect = answers.filter((a) => a.isCorrect).length;
      const iqEstimate = 80 + Math.round((totalCorrect / questions.length) * 40);

      fetch(`${SUPABASE_URL}/rest/v1/results`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify([
          {
            name: userName,
            score: totalCorrect,
            max_score: questions.length,
            iq: iqEstimate,
            results_json: answers,
          }
        ]),
      })
        .then(() => console.log("✅ Submitted to Supabase"))
        .catch((err) => console.error("❌ Submit error:", err));

      setSent(true);
    }
  }, [submitted, sent, answers, questions, userName]);

  const handleAnswer = (selected) => {
    const q = questions[current];
    const isCorrect =
      String(selected).trim().toLowerCase() === String(q.answer).trim().toLowerCase();

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
        Q{i + 1}: {a.question} | Your Answer: <strong>{a.selected}</strong> | Correct Answer:{" "}
        <strong>{a.correctAnswer}</strong> |{" "}
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
