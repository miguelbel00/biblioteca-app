import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loading from "../../components/ui/Loading";
import Pagination from "../../components/Pagination";
import LoanFormModal from "../../components/loans/loanFormModal";

export default function LoanList() {
  const [loans, setLoans] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [error, setError] = useState(null);

  const fetchLoans = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/loans?page=${page}`);
      setLoans(res.data.data ?? res.data);
      setMeta(res.data.meta ?? null);
    } catch (error) {
      console.error("Error loading loans:", error);
      setError("Failed to load loans.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;

    try {
      await api.delete(`/loans/${id}`);
      fetchLoans(page);
    } catch (error) {
      alert("Error deleting loan.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLoans(page);
  }, [page]);

  if (loading) return <Loading text="Loading loans..." />;

  return (
    <div className="min-h-screen bg-wood-light flex flex-col items-center py-6 px-3 md:px-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-wood-medium">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-wood-dark">
            Loan List
          </h2>
          <button
            onClick={() => {
              setSelectedLoan(null);
              setShowModal(true);
            }}
            className="w-full sm:w-auto bg-wood-dark hover:bg-wood-medium text-white px-4 py-2 rounded-lg font-semibold transition-all"
          >
            New Loan
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {loans.length === 0 ? (
          <p className="text-center text-wood-text">No loans registered.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-wood-light">
            <table className="w-full text-sm md:text-base border-collapse">
              <thead>
                <tr className="bg-wood-medium text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Book</th>
                  <th className="p-3 text-left">Loan Date</th>
                  <th className="p-3 text-left">Return Date</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="border-b border-wood-light hover:bg-wood-accent/10 transition-colors"
                  >
                    <td className="p-3 whitespace-nowrap">{loan.id}</td>
                    <td className="p-3">{loan.user?.email ?? "No user"}</td>
                    <td className="p-3">{loan.book?.title ?? "No book"}</td>
                    <td className="p-3">{loan.loan_date}</td>
                    <td className="p-3">{loan.return_date ?? "—"}</td>
                    <td className="p-3 text-center">
                      {loan.return_date ? (
                        <span className="text-green-700 font-semibold">
                          Returned
                        </span>
                      ) : (
                        <span className="text-red-700 font-semibold">Active</span>
                      )}
                    </td>
                    <td className="p-3 text-center flex justify-center gap-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedLoan(loan);
                          setShowModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(loan.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      </div>

      {showModal && (
        <LoanFormModal
          loan={selectedLoan}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchLoans(page);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
