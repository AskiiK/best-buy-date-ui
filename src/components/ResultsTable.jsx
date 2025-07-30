export default function ResultsTable({ data }) {
    return (
      <div className="mt-6 border rounded-lg shadow-sm overflow-x-auto bg-white">
        <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">📊 Best Buy Dates Summary</h2>
        <table className="w-full table-auto text-sm sm:text-base">
          <thead className="bg-blue-50 text-blue-800">
            <tr>
              <th className="py-3 px-4 border-b">Time Window</th>
              <th className="py-3 px-4 border-b">Best Buy Date</th>
              <th className="py-3 px-4 border-b">Buy Price</th>
              <th className="py-3 px-4 border-b">Today’s Price</th>
              <th className="py-3 px-4 border-b">Return %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={idx} className="text-center hover:bg-gray-50">
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
  