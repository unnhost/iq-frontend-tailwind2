
import { useState } from "react";
import IQTestApp from "./IQTestApp";

export default function AppWrapper() {
  const [name, setName] = useState(() => localStorage.getItem("iq_user_name") || "");
  const [started, setStarted] = useState(!!name);

  const handleStart = () => {
    if (name.trim().length > 0) {
      localStorage.setItem("iq_user_name", name.trim());
      setStarted(true);
    }
  };

  if (started) {
    return <IQTestApp userName={name} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome to the IQ Challenge</h1>
        <p className="mb-6 text-gray-600">Enter your name to begin:</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
        />
        <button
          onClick={handleStart}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Start the Test
        </button>
      </div>
    </div>
  );
}
