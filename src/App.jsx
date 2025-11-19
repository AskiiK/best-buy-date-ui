import { useEffect, useMemo, useState } from 'react'
import AssetSelector from './components/AssetSelector.jsx'
import CheckButton from './components/CheckButton.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import TickerInput from './components/TickerInput.jsx'
import {
  DEFAULT_SUGGESTION_COUNT,
  MIN_SEARCH_CHARS,
  POPULAR_TICKERS,
  TICKER_UNIVERSE,
  getTickerSuggestions,
  normalizeTickerSymbol,
} from './tickers.js'
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
  const [tickerUniverse, setTickerUniverse] = useState(TICKER_UNIVERSE)
  const [popularTickers, setPopularTickers] = useState(POPULAR_TICKERS)
  const [tickerDirectoryStatus, setTickerDirectoryStatus] = useState('idle')
  const [tickerDirectoryError, setTickerDirectoryError] = useState('')

  const normalizedTicker = ticker.trim().toUpperCase()
  const canSubmit = Boolean(
    normalizedTicker && assetType && timeWindow && status !== 'loading',
  )

  const suggestions = useMemo(
    () =>
      getTickerSuggestions(ticker, DEFAULT_SUGGESTION_COUNT, {
        universe: tickerUniverse,
        popular: popularTickers,
      }),
    [ticker, tickerUniverse, popularTickers],
  )

  const trimmedLength = ticker.trim().length
  const showMinCharsHint =
    trimmedLength > 0 && trimmedLength < MIN_SEARCH_CHARS
  const showNoMatches =
    trimmedLength >= MIN_SEARCH_CHARS && suggestions.length === 0

  const handlePickSuggestion = (symbol) => {
    setTicker(symbol)
  }
  useEffect(() => {
    if (!apiBase) return

    let ignore = false
    const controller = new AbortController()

    const fetchDirectory = async () => {
      setTickerDirectoryStatus('loading')
      setTickerDirectoryError('')

      try {
        const response = await fetch(`${apiBase}/nse-tickers`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load the NSE ticker directory right now.')
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response received for the NSE ticker directory.')
        }

        if (ignore) return

        const normalized = data
          .map((item) => {
            const cleanedSymbol = normalizeTickerSymbol(item.symbol)
            return {
              symbol: cleanedSymbol || normalizeTickerSymbol(item?.ticker),
              name: item.name || cleanedSymbol || item.symbol,
            }
          })
          .filter((item) => item.symbol)
        const deduped = []
        const seen = new Set()

        for (const entry of normalized) {
          const key = entry.symbol.toUpperCase()
          if (seen.has(key)) continue
          seen.add(key)
          deduped.push(entry)
        }

        if (deduped.length > 0) {
          setTickerUniverse(deduped)
          setPopularTickers(deduped.slice(0, POPULAR_TICKERS.length))
          setTickerDirectoryStatus('ready')
        } else {
          setTickerDirectoryStatus('error')
          setTickerDirectoryError(
            'The NSE ticker directory returned no entries. Showing the bundled tickers instead.',
          )
        }
      } catch (directoryError) {
        if (ignore || directoryError.name === 'AbortError') {
          return
        }
        setTickerDirectoryStatus('error')
        setTickerDirectoryError(
          directoryError.message ||
            'Unable to refresh the NSE tickers. Using the offline list.',
        )
      }
    }

    fetchDirectory()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [apiBase])

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
      const fallbackMessage =
        fetchError instanceof TypeError
          ? 'Unable to reach the API. If you are running the static build, enable CORS on best-buy-date.onrender.com or run the app locally with `npm run dev`.'
          : fetchError.message || 'Something went wrong. Try again later.'
      setError(fallbackMessage)
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
            minSearchChars={MIN_SEARCH_CHARS}
            showMinCharsHint={showMinCharsHint}
            showNoMatches={showNoMatches}
            directoryStatus={tickerDirectoryStatus}
            directoryError={tickerDirectoryError}
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
