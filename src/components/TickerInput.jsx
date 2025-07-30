export default function TickerInput({ value, onChange }) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter Ticker (e.g. INFY.NS)"
        className="border rounded px-3 py-2 w-full"
      />
    );
  }
  