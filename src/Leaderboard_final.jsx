import { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get("https://iq-backend-bc3f.onrender.com/leaderboard")
      .then(res => setLeaders(res.data))
      .catch(err => console.error("Error fetching leaderboard:", err));
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">IQ Leaderboard 🏅</h1>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2">Rank</th>
            <th>Name</th>
            <th>IQ</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={index} className="text-center border-b last:border-0">
              <td className="py-2">{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.iq}</td>
              <td>{user.score}/{user.max_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;