import { useState } from "react";
import api from "../../api/axios";

export default function LoanFormModal({ loan, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    user_email: loan?.user?.email || "",
    book_id: loan?.book?.id || "",
    fecha_devolucion: loan?.return_date
      ? loan.return_date.slice(0, 10)
      : "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (loan) {
        // PUT para actualizar préstamo existente
        await api.post(`/loans/${loan.id}/return`, formData);
      } else {
        // POST para crear nuevo préstamo
        await api.post("/loans", formData);
      }
      onSuccess();
    } catch (err) {
      const message =
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : err.response?.data?.message || "Error saving loan";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h3 className="text-2xl font-semibold mb-4 text-wood-dark text-center">
          {loan ? "Edit Loan" : "Create New Loan"}
        </h3>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* USER EMAIL */}
          <label className="flex flex-col text-sm font-medium text-wood-text">
            User Email
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              className="border border-wood-medium rounded-lg p-2 focus:ring-2 focus:ring-wood-dark"
              required
              disabled={!!loan} // no permitir cambiar usuario en edición
            />
          </label>

          {/* BOOK ID */}
          <label className="flex flex-col text-sm font-medium text-wood-text">
            Book ID
            <input
              type="number"
              name="book_id"
              value={formData.book_id}
              onChange={handleChange}
              className="border border-wood-medium rounded-lg p-2 focus:ring-2 focus:ring-wood-dark"
              required
              disabled={!!loan} // no permitir cambiar libro en edición
            />
          </label>

          {/* RETURN DATE (solo en edición) */}
          {loan && (
            <label className="flex flex-col text-sm font-medium text-wood-text">
              Return Date
              <input
                type="date"
                name="fecha_devolucion"
                value={formData.return_date}
                onChange={handleChange}
                className="border border-wood-medium rounded-lg p-2 focus:ring-2 focus:ring-wood-dark"
              />
            </label>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-wood-dark hover:bg-wood-medium text-white text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : loan ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
