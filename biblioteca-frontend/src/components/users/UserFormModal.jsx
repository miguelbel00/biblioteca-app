import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function UserFormModal({ isOpen, onClose, onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    reset(defaultValues);
    setServerErrors({});
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      setServerErrors({});
    } catch (error) {
      if (error.response?.data?.errors) {
        setServerErrors(error.response.data.errors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-wood-medium">
        <h3 className="text-xl font-bold text-wood-dark mb-4 text-center">
          {defaultValues?.id ? "Edit User" : "Add New User"}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div>
            <label className="block text-wood-dark font-medium mb-1">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full border border-wood-light rounded-lg p-2 focus:ring-2 focus:ring-wood-medium outline-none"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
            {serverErrors.name && (
              <p className="text-red-600 text-sm mt-1">{serverErrors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-wood-dark font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-wood-light rounded-lg p-2 focus:ring-2 focus:ring-wood-medium outline-none"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
            {serverErrors.email && (
              <p className="text-red-600 text-sm mt-1">{serverErrors.email[0]}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-wood-medium text-white rounded-lg hover:bg-wood-dark transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
