export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null; 

  const { current_page, last_page } = meta;

  const goToPage = (page) => {
    if (page >= 1 && page <= last_page) {
      onPageChange(page);
    }
  };

  const pages = [];
  for (let i = 1; i <= last_page; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center mt-6 flex-wrap gap-2">
      <button
        onClick={() => goToPage(current_page - 1)}
        disabled={current_page === 1}
        className="px-4 py-2 rounded-lg bg-wood-medium text-white disabled:opacity-50 hover:bg-wood-dark transition-colors"
      >
        Previus
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1 rounded-lg ${
            page === current_page
              ? "bg-wood-dark text-white"
              : "bg-wood-light text-wood-dark hover:bg-wood-accent hover:text-white"
          } transition-colors`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => goToPage(current_page + 1)}
        disabled={current_page === last_page}
        className="px-4 py-2 rounded-lg bg-wood-medium text-white disabled:opacity-50 hover:bg-wood-dark transition-colors"
      >
        Next
      </button>
    </div>
  );
}
