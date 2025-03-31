
import { useEffect, useState } from "react";

const API_URL = "https://iq-backend-bc3f.onrender.com";
const ADMIN_TOKEN = "admin-token";

export default function AdminPanel() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ min_iq: "", max_iq: "" });

  const fetchResults = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page,
      ...filters.min_iq && { min_iq: filters.min_iq },
      ...filters.max_iq && { max_iq: filters.max_iq },
    });

    const res = await fetch(`${API_URL}/results?${params.toString()}`, {
      headers: { "x-token": ADMIN_TOKEN }
    });

    if (res.ok) {
      const data = await res.json();
      setResults(data.results || []);
    } else {
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 Admin Results Panel</h1>

      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="number"
          name="min_iq"
          value={filters.min_iq}
          onChange={handleFilterChange}
          placeholder="Min IQ"
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          name="max_iq"
          value={filters.max_iq}
          onChange={handleFilterChange}
          placeholder="Max IQ"
          className="border rounded px-3 py-2"
        />
        <button onClick={fetchResults} className="bg-blue-600 text-white px-4 py-2 rounded">
          Apply Filters
        </button>
      </div>

      {loading ? (
        <p>Loading results...</p>
      ) : (
        <table className="table-auto w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">User</th>
              <th className="border px-2 py-1">IQ</th>
              <th className="border px-2 py-1">Score</th>
              <th className="border px-2 py-1">Categories</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{r.user_id}</td>
                <td className="border px-2 py-1">{r.estimated_iq}</td>
                <td className="border px-2 py-1">{r.score}</td>
                <td className="border px-2 py-1">
                  {r.category_scores ? Object.entries(r.category_scores).map(([cat, val]) => (
                    <div key={cat}>{cat}: {val}</div>
                  )) : "-"}
                </td>
                <td className="border px-2 py-1">{r.submitted_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 border rounded"
        >
          Previous
        </button>
        <span className="self-center">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
