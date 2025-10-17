import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function BookFormModal({ isOpen, onClose, onSubmit, defaultValues }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  // Reset al abrir modal con datos nuevos
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg border border-wood-medium">
        <h3 className="text-xl font-bold text-wood-dark mb-4 text-center">
          {defaultValues?.id ? "Edit Book" : "Add New Book"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-wood-dark font-medium mb-1">Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full border border-wood-light rounded-lg p-2 focus:ring-2 focus:ring-wood-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-wood-dark font-medium mb-1">Author</label>
            <input
              {...register("author", { required: true })}
              className="w-full border border-wood-light rounded-lg p-2 focus:ring-2 focus:ring-wood-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-wood-dark font-medium mb-1">Genre</label>
            <input
              {...register("genre")}
              className="w-full border border-wood-light rounded-lg p-2 focus:ring-2 focus:ring-wood-medium outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("available")} />
            <span className="text-wood-dark">Available</span>
          </div>

          <div className="flex justify-end gap-3 mt-4">
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
