export default function AssetSelector({ value, onChange }) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="stock">Stock</option>
        <option value="mutual_fund">Mutual Fund</option>
      </select>
    );
  }
  