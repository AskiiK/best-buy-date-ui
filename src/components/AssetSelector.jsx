export default function AssetSelector({ value, onChange }) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="stock">Stock</option>
        <option value="mutual_fund">Mutual Fund</option>
      </select>
    );
  }
  
