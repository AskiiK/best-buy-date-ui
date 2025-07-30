import { useState } from 'react';
import { TICKERS } from '../tickers';

export default function TickerInput({ value, onChange }) {
  const [showList, setShowList] = useState(false);

  const filtered = TICKERS.filter(
    (t) =>
      value && t.toLowerCase().startsWith(value.toLowerCase()) &&
      t.toLowerCase() !== value.toLowerCase()
  ).slice(0, 5);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowList(true);
        }}
        onBlur={() => setTimeout(() => setShowList(false), 100)}
        placeholder="Enter Ticker (e.g. INFY.NS)"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {showList && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-auto">
          {filtered.map((t) => (
            <li
              key={t}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              onMouseDown={() => onChange(t)}
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
  