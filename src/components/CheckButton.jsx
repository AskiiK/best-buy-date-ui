export default function CheckButton({ onClick, loading }) {
    return (
      <button
        onClick={onClick}
        disabled={loading}
        className={`px-6 py-2 rounded-md text-white font-semibold shadow-sm transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Checking...' : 'Check Dates'}
      </button>
    );
  }
  