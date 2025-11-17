const formatKey = (key) =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const formatValue = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }

  return value ?? '—'
}

function ResultsTable({ result, lastQuery }) {
  if (!result) {
    return null
  }

  const entries = Object.entries(result)

  return (
    <section className="results">
      <header className="results__header">
        <div>
          <p className="eyebrow">Results</p>
          <h2>
            {lastQuery?.ticker} • {lastQuery?.time_window}
          </h2>
        </div>
        <p className="results__subtitle">
          Historical analysis is calculated with data from Yahoo Finance.
        </p>
      </header>
      <div className="results__table-wrapper">
        <table className="results__table">
          <tbody>
            {entries.map(([key, value]) => (
              <tr key={key}>
                <th scope="row">{formatKey(key)}</th>
                <td>{formatValue(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ResultsTable
