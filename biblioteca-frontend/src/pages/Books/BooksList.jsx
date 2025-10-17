import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loading from "../../components/ui/Loading";
import Pagination from "../../components/Pagination";
import BookFormModal from "../../components/books/BookFormModal";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/books?page=${page}`);
      setBooks(res.data.data ?? res.data);
      setMeta(res.data.pagination ?? null);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks(page);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedBook) {
        await api.put(`/books/${selectedBook.id}`, data);
      } else {
        await api.post("/books", data);
      }
      setModalOpen(false);
      setSelectedBook(null);
      fetchBooks(page);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  if (loading) return <Loading text="Loading books..." />;

  return (
    <div className="min-h-screen bg-wood-light flex flex-col items-center py-6 px-3 md:px-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-wood-medium">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-wood-dark">
            Book List
          </h2>
          <button
            onClick={() => {
              setSelectedBook(null);
              setModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-wood-medium text-white rounded-lg hover:bg-wood-dark transition"
          >
            + Add Book
          </button>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto rounded-lg border border-wood-light">
          <table className="w-full text-sm md:text-base border-collapse">
            <thead>
              <tr className="bg-wood-medium text-white">
                <th className="p-3 text-left">Id</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Author</th>
                <th className="p-3 text-left">Genre</th>
                <th className="p-3 text-center">Availability</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-wood-light hover:bg-wood-accent/10 transition-colors"
                >
                  <td className="p-3 whitespace-nowrap">{book.id}</td>
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3">{book.genre}</td>
                  <td className="p-3 text-center">
                    {book.available ? (
                      <span className="text-green-700 font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="text-red-700 font-semibold">
                        Borrowed
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      </div>

      {/* Modal */}
      <BookFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        defaultValues={
          selectedBook || { title: "", author: "", genre: "", available: true }
        }
      />
    </div>
  );
}
