import { useState, useEffect } from "react";

const API_URL = "https://iq-backend-bc3f.onrender.com";

export default function IQTestApp({ userName }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [log, setLog] = useState([]);

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
    
  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const iqEstimate = 80 + Math.round((totalCorrect / totalQuestions) * 40); // crude estimate

  const renderSummary = () =>
    answers.map((a, i) => (
      <li key={i}>
        Q{i + 1}: {a.question} | Your Answer: <strong>{a.selected}</strong> | Correct Answer: <strong>{a.correctAnswer}</strong> |{" "}
        {a.isCorrect ? "✅ Correct" : "❌ Incorrect"} | Time: <strong>{a.time}s</strong>
      </li>
    ));

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
  setLog((prev) => [...prev, newAnswer]);

  const next = current + 1;
  if (next < questions.length) {
    setCurrent(next);
    setTimeLeft(30);
  } else {
    setSubmitted(true);
  }
};


  useEffect(() => {
    if (questions.length > 0 && current === questions.length && !submitted) {
      fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName, answers }),  // ✅ include name
      })
        .then((res) => res.json())
        .then((data) => {
          setResult(data);
          setSubmitted(true);
        })
        .catch((err) => {
          console.error("Error submitting answers:", err);
        });
    }
  }, [current, submitted, answers, questions]);

  if (questions.length === 0) return <p className="p-6 text-center text-lg">Loading...</p>;

  if (submitted && questions.length > 0) {
    
  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const iqEstimate = 80 + Math.round((totalCorrect / totalQuestions) * 40); // crude estimate

  const renderSummary = () =>
    answers.map((a, i) => (
      <li key={i}>
        Q{i + 1}: {a.question} | Your Answer: <strong>{a.selected}</strong> | Correct Answer: <strong>{a.correctAnswer}</strong> |{" "}
        {a.isCorrect ? "✅ Correct" : "❌ Incorrect"} | Time: <strong>{a.time}s</strong>
      </li>
    ));

  return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Real IQ Score</h1>
        <p className="text-xl mb-4">🧠 <strong>Estimated IQ: {iqEstimate}</strong> {iqEstimate} <strong>{result?.estimated_iq}</strong></p>
        <p className="mb-6"><strong>Score: {totalCorrect} / {totalQuestions}</strong> {result?.score} / {result?.max_score}</p>
        
        <h2 className="text-xl font-semibold mb-2">🧩 Category Performance:</h2>
        <ul className="mb-6 text-left list-disc list-inside">
          {result?.category_scores && Object.entries(result.category_scores).map(([cat, score]) => (
            <li key={cat}><strong>{cat}</strong>: {score} pts</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2">💬 Feedback:</h2>
        <ul className="mb-6 text-left list-disc list-inside">
          {result?.feedback && result.feedback.map((f, i) => (
            <li key={i}>• {f}</li>
          ))}
        </ul>

        <h3 className="text-lg font-medium mb-2">📜 Answer Summary:
<ul>{renderSummary()}</ul></h3>
        <ul className="mb-6 text-left list-disc list-inside">
          {log.map((entry, i) => (
            <li key={i}>
              Q{i + 1}: {entry.selected || "(No answer)"} | Correct: {entry.correct} | Time: {entry.timeTaken}s | {entry.status}
            </li>
          ))}
        </ul>

        <div className="flex justify-center space-x-4">
          <button onClick={() => window.location.reload()} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">Retake Test</button>
          <button onClick={() => window.location.href = "/"} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500">Go to Home</button>
        </div>
      </div>
    );
  }

  if (current >= questions.length || questions.length === 0) {
    return <p className="p-6 text-center text-lg">Submitting your answers...</p>;
  }

  const q = questions[current];

  
  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const iqEstimate = 80 + Math.round((totalCorrect / totalQuestions) * 40); // crude estimate

  const renderSummary = () =>
    answers.map((a, i) => (
      <li key={i}>
        Q{i + 1}: {a.question} | Your Answer: <strong>{a.selected}</strong> | Correct Answer: <strong>{a.correctAnswer}</strong> |{" "}
        {a.isCorrect ? "✅ Correct" : "❌ Incorrect"} | Time: <strong>{a.time}s</strong>
      </li>
    ));

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Question {current + 1} / {questions.length}</h2>
      <p className="mb-6 text-lg">{q.question}</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(q.options).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleAnswer(key)}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500"
          >
            {key}: {val}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600">Time left: {timeLeft}s</p>
    </div>
  );
}