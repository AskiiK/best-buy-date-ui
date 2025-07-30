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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📈 Best Buy Date Finder</h1>
      <div className="flex gap-4 mb-4">
        <AssetSelector value={assetType} onChange={setAssetType} />
        <TickerInput value={ticker} onChange={setTicker} />
        <CheckButton onClick={fetchResults} loading={loading} />
      </div>
      {results && <ResultsTable data={results} />}
    </div>
  );
}

export default App;
