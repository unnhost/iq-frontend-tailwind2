import React, { useState } from "react";
import IQTestApp from "./IQTestApp";
import Leaderboard from "./Leaderboard";

const AppWrapper = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="text-center p-4">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
        >
          {showLeaderboard ? "Back to IQ Test" : "🏆 Show Leaderboard"}
        </button>
      </div>

      {showLeaderboard ? <Leaderboard /> : <IQTestApp />}
    </div>
  );
};

export default AppWrapper;