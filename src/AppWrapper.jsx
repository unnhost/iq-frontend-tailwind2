import { useState } from "react";
import IQTestApp from "./IQTestApp";

export default function AppWrapper() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Ultimate IQ Test</h1>
        <p className="mb-6 text-gray-600">Enter your name to begin:</p>
        <input
          className="border border-gray-300 px-4 py-2 rounded w-64 text-center mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
          disabled={!name.trim()}
          onClick={() => setStarted(true)}
        >
          Start Test
        </button>
      </div>
    );
  }

  return <IQTestApp userName={name} />;
}
