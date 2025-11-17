import { useMemo, useState } from 'react'
import AssetSelector from './components/AssetSelector.jsx'
import CheckButton from './components/CheckButton.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import TickerInput from './components/TickerInput.jsx'
import { DEFAULT_SUGGESTION_COUNT, POPULAR_TICKERS } from './tickers.js'
import './App.css'

const TIME_WINDOWS = [
  { value: '1y', label: '1 Year' },
  { value: '3y', label: '3 Years' },
  { value: '5y', label: '5 Years' },
  { value: '10y', label: '10 Years' },
]

const apiBase = import.meta.env.VITE_API_URL

function App() {
  const [assetType, setAssetType] = useState('stock')
  const [ticker, setTicker] = useState('')
  const [timeWindow, setTimeWindow] = useState(TIME_WINDOWS[0].value)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [lastQuery, setLastQuery] = useState(null)

  const normalizedTicker = ticker.trim().toUpperCase()
  const canSubmit = Boolean(
    normalizedTicker && assetType && timeWindow && status !== 'loading',
  )

  const suggestions = useMemo(() => {
    if (!ticker) {
      return POPULAR_TICKERS.slice(0, DEFAULT_SUGGESTION_COUNT)
    }

    const query = ticker.trim().toLowerCase()
    return POPULAR_TICKERS.filter(
      (item) =>
        item.symbol.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query),
    ).slice(0, DEFAULT_SUGGESTION_COUNT)
  }, [ticker])

  const handlePickSuggestion = (symbol) => {
    setTicker(symbol)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    if (!apiBase) {
      setError('API URL is missing. Check your .env file.')
      return
    }

    setStatus('loading')
    setError('')
    setResult(null)

    const payload = {
      asset_type: assetType,
      ticker: normalizedTicker,
      time_window: timeWindow,
    }

    try {
      const response = await fetch(`${apiBase}/best-buy-date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok || data?.error) {
        throw new Error(data?.error || 'Unable to fetch results right now.')
      }

      setResult(data)
      setLastQuery(payload)
      setStatus('success')
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong. Try again later.')
      setStatus('error')
    }
  }

  return (
    <div className="app-shell">
      <main className="panel">
        <header className="panel__header">
          <p className="eyebrow">Best Buy Date</p>
          <h1>Find the most profitable entry date</h1>
          <p className="lead">
            Choose an asset, enter the ticker, and we will crunch the historical
            Yahoo Finance data to show you the day that would have maximized
            today’s gains.
          </p>
        </header>

        <form className="query-form" onSubmit={handleSubmit}>
          <AssetSelector value={assetType} onChange={setAssetType} />

          <TickerInput
            value={ticker}
            onChange={setTicker}
            suggestions={suggestions}
            onPickSuggestion={handlePickSuggestion}
            disabled={status === 'loading'}
          />

          <div className="form-control">
            <label className="field-label">Time window</label>
            <div className="pill-group">
              {TIME_WINDOWS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`pill ${
                    option.value === timeWindow ? 'pill--active' : ''
                  }`}
                  onClick={() => setTimeWindow(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <CheckButton disabled={!canSubmit} loading={status === 'loading'} />
        </form>

        {status === 'loading' ? (
          <p className="status-text" role="status">
            Crunching the numbers…
          </p>
        ) : null}

        {error ? (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        ) : null}

        {status === 'success' && result ? (
          <ResultsTable result={result} lastQuery={lastQuery} />
        ) : null}
      </main>
    </div>
  )
}

export default App
