import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loading from "../../components/ui/Loading";
import Pagination from "../../components/Pagination";
import UserFormModal from "../../components/users/UserFormModal";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}`);
      setUsers(res.data.data ?? res.data);
      setMeta(res.data.pagination ?? null);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers(page);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, data);
      } else {
        await api.post("/users", data);
      }
      setModalOpen(false);
      setSelectedUser(null);
      fetchUsers(page);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  if (loading) return <Loading text="Loading users..." />;

  return (
    <div className="min-h-screen bg-wood-light flex flex-col items-center py-6 px-3 md:px-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-wood-medium">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-wood-dark">User List</h2>
          <button
            onClick={() => {
              setSelectedUser(null);
              setModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-wood-medium text-white rounded-lg hover:bg-wood-dark transition"
          >
            + Add User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-wood-light">
          <table className="w-full text-sm md:text-base border-collapse">
            <thead>
              <tr className="bg-wood-medium text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-wood-light hover:bg-wood-accent/10 transition-colors"
                >
                  <td className="p-3 whitespace-nowrap">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 text-center flex justify-center gap-2 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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

        <div className="mt-6">
          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      </div>

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        defaultValues={selectedUser || { name: "", email: "" }}
      />
    </div>
  );
}
