
// Working demo template for testing Supabase connection
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
    fetch("https://iq-backend-bc3f.onrender.com/questions")
      .then((res) => res.json())
      .then(setQuestions);
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
        body: JSON.stringify([{
          name: userName,
          score: totalCorrect,
          max_score: questions.length,
          iq: iqEstimate,
          results_json: answers,
        }]),
      })
      .then(() => console.log("✅ Submitted to Supabase"))
      .catch((err) => console.error("❌ Submit error:", err));
      setSent(true);
    }
  }, [submitted, sent, answers, questions, userName]);

  return <div className="p-4">Working demo — Supabase is connected</div>;
}
