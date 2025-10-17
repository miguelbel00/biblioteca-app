import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loading from "../../components/ui/Loading";

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/statistics");
      setStats(res.data.data);
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loading text="Loading statistics..." />;

  if (!stats)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium">
          Error loading statistics.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-wood-light flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8 border border-wood-medium">
        <h2 className="text-3xl font-bold text-wood-dark mb-8 text-center">
          📊 Library Statistics
        </h2>

        {/* === Main stats cards === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Books" value={stats.total_books} />
          <StatCard title="Available Books" value={stats.available_books} />
          <StatCard title="Loaned Books" value={stats.loaned_books} />
          <StatCard title="Active Loans" value={stats.active_loans} />
          <StatCard title="Returned Loans" value={stats.returned_loans} />
        </div>

        {/* === Top Users Table === */}
        <h3 className="text-2xl font-semibold text-wood-dark mb-4 text-center">
          🏅 Top Active Users
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-wood-medium text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Active Loans</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_users && stats.top_users.length > 0 ? (
                stats.top_users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-wood-light hover:bg-wood-accent/10 transition-colors"
                  >
                    <td className="p-3 text-wood-text">{user.name}</td>
                    <td className="p-3 text-wood-text">{user.email}</td>
                    <td className="p-3 text-center font-semibold text-wood-dark">
                      {user.loans_count ?? 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="p-3 text-center text-wood-text italic"
                  >
                    No user data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// === Small reusable stat card ===
function StatCard({ title, value }) {
  return (
    <div className="bg-wood-accent/10 border border-wood-medium rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
      <p className="text-wood-dark text-lg font-semibold">{title}</p>
      <p className="text-4xl font-bold text-wood-dark mt-2">{value}</p>
    </div>
  );
}
