
import { useState, useEffect } from "react";

const API_URL = "https://iq-backend-bc3f.onrender.com";

export default function IQTestApp({ userName }) {
  const [questions, setQuestions] = useState([]);
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
        <p className="text-xl mb-4">🧠 <strong>Estimated IQ: {iqEstimate}</strong></p>
        <p className="mb-6"><strong>Score: {totalCorrect} / {totalQuestions}</strong></p>
        <h3 className="text-lg font-semibold mb-2">Answer Summary:</h3>
        <ul>{renderSummary()}</ul>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retake Test
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">Question {current + 1}</h2>
      <p className="mb-4 text-lg">{q.question}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            {opt}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">Time left: {timeLeft}s</p>
    </div>
  );
}
