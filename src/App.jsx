import { useMemo, useState } from 'react';
import AssetSelector from './components/AssetSelector';
import TickerInput from './components/TickerInput';
import CheckButton from './components/CheckButton';
import ResultsTable from './components/ResultsTable';

function App() {
  const [assetType, setAssetType] = useState('stock');
  const [ticker, setTicker] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiBaseUrl = useMemo(() => {
    const envBaseUrl = import.meta.env.VITE_API_URL;
    const fallback = 'http://localhost:8000';

    const trimmed = typeof envBaseUrl === 'string' ? envBaseUrl.trim() : '';
    const baseUrl = trimmed.length > 0 ? trimmed : fallback;

    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }, []);

  const fetchResults = async () => {
      if (!ticker.trim()) {
      setError('Enter a ticker symbol to continue.');
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timeWindows = ['7d', '30d', '1y', '3y', '5y', 'max'];
      const responses = await Promise.all(
         timeWindows.map(async (window) => {
          const response = await fetch(`${apiBaseUrl}/best-buy-date`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ asset_type: assetType, ticker, time_window: window })
            });

          if (!response.ok) {
            const message = await response.text();
            throw new Error(message || `Request failed with status ${response.status}`);
          }

          return response.json();
        })
      );
      const formatted = timeWindows.map((window, idx) => ({
        window,
        ...responses[idx]
      }));
      setResults(formatted);
    } catch (err) {
      console.error('Fetch failed', err);
       setResults(null);
        setError('Unable to load results. Please try again in a moment.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-6 max-w-3xl w-full">
        {/* You can uncomment this line if you want a visible "Tailwind is working!" message
            or remove it if your components like AssetSelector, TickerInput, etc.,
            already visibly use Tailwind for styling. */}
        <h1 className="text-4xl font-bold text-blue-600 underline mb-6">Tailwind is working!</h1>

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          📈 Best Buy Date Finder
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end mb-6">
          <div className="flex-1">
            <AssetSelector value={assetType} onChange={setAssetType} />
          </div>
          <div className="flex-1">
            <TickerInput value={ticker} onChange={setTicker} />
          </div>
          <div>
            <CheckButton onClick={fetchResults} loading={loading} />
          </div>
        </div>

         {error && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {results && !error && <ResultsTable data={results} />}

        <p className="text-center text-sm text-gray-500 mt-8">
          Built by Abhishek ⚡ Powered by FastAPI & Vite
        </p>
      </div>
    </div>
  );
}

export default App;