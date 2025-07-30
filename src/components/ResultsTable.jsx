export default function ResultsTable({ data }) {
    return (
      <div className="mt-6 border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">📊 Best Buy Dates Summary</h2>
        <table className="w-full border-collapse mt-4 text-sm sm:text-base">
        <thead className="bg-blue-50 text-blue-800">
            <tr>
            <th className="py-2 px-4 border-b">Time Window</th>
            <th className="py-2 px-4 border-b">Best Buy Date</th>
            <th className="py-2 px-4 border-b">Buy Price</th>
            <th className="py-2 px-4 border-b">Today’s Price</th>
            <th className="py-2 px-4 border-b text-center">Return %</th>
            </tr>
        </thead>
        <tbody>
            {data.map((entry, idx) => (
            <tr key={idx} className="hover:bg-gray-50 text-center">
                <td className="py-2 px-4">{entry.window}</td>
                <td className="py-2 px-4">{entry.best_buy_date || 'N/A'}</td>
                <td className="py-2 px-4">{entry.buy_price ?? 'N/A'}</td>
                <td className="py-2 px-4">{entry.today_price ?? 'N/A'}</td>
                <td className={`py-2 px-4 font-semibold ${entry.return_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {entry.return_pct != null ? `${entry.return_pct}%` : 'N/A'}
                </td>
            </tr>
            ))}
        </tbody>
        </table>

      </div>
    );
  }
  