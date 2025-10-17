import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loading from "../../components/ui/Loading";
import Pagination from "../../components/Pagination";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/books?page=${page}`);
      setBooks(res.data.data ?? res.data);
      setMeta(res.data.meta ?? null);
    } catch (error) {
      console.error("Error al cargar libros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  if (loading) return <Loading text="Loading books..." />;

  return (
    <div className="min-h-screen bg-wood-light flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8 border border-wood-medium">
        <h2 className="text-3xl font-bold text-wood-dark mb-6 text-center"> Book List</h2>

        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-wood-medium text-white">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Genre</th>
              <th className="p-3 text-center">Available</th> {/* <- alinear al centro */}
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr
                key={book.id}
                className="border-b border-wood-light hover:bg-wood-accent/10 transition-colors"
              >
                <td className="p-3 text-left text-wood-text">{book.title}</td>
                <td className="p-3 text-left text-wood-text">{book.author}</td>
                <td className="p-3 text-left text-wood-text">{book.genre}</td>
                <td className="p-3 text-center">
                  {book.available ? (
                    <span className="text-green-700 font-semibold">Available</span>
                  ) : (
                    <span className="text-red-700 font-semibold">Borrowed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      <Pagination meta={meta} onPageChange={setPage} />


      </div>

    </div>
  );
}
