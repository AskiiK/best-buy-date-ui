export default function CheckButton({ onClick, loading }) {
    return (
      <button
        onClick={onClick}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Checking...' : 'Check Dates'}
      </button>
    );
  }
  