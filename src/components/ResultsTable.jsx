export default function ResultsTable({ data }) {
    return (
      <div className="mt-6 border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">📊 Best Buy Dates Summary</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">Time Window</th>
              <th className="border-b py-2">Best Buy Date</th>
              <th className="border-b py-2">Buy Price</th>
              <th className="border-b py-2">Today’s Price</th>
              <th className="border-b py-2">Return %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-2">{entry.window}</td>
                <td className="py-2">{entry.best_buy_date || 'N/A'}</td>
                <td className="py-2">{entry.buy_price ?? 'N/A'}</td>
                <td className="py-2">{entry.today_price ?? 'N/A'}</td>
                <td className={`py-2 ${entry.return_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.return_pct != null ? `${entry.return_pct}%` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  