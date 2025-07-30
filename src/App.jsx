import { useState } from 'react';
import AssetSelector from './components/AssetSelector';
import TickerInput from './components/TickerInput';
import CheckButton from './components/CheckButton';
import ResultsTable from './components/ResultsTable';

function App() {
  const [assetType, setAssetType] = useState('stock');
  const [ticker, setTicker] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const timeWindows = ['7d', '30d', '1y', '3y', '5y', 'max'];
      const responses = await Promise.all(
        timeWindows.map(window =>
          fetch(`${import.meta.env.VITE_API_URL}/best-buy-date`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ asset_type: assetType, ticker, time_window: window })
          }).then(res => res.json())
        )
      );
      const formatted = timeWindows.map((window, idx) => ({
        window,
        ...responses[idx]
      }));
      setResults(formatted);
    } catch (err) {
      console.error('Fetch failed', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-6 max-w-3xl w-full">
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

        {results && <ResultsTable data={results} />}

        <p className="text-center text-sm text-gray-500 mt-8">
          Built by Abhishek ⚡ Powered by FastAPI & Vite
        </p>
      </div>
    </div>
  );
}

export default App;
