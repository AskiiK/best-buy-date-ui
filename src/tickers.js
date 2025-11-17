import tickerUniverse from './data/tickers.json'

export const POPULAR_TICKERS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Class A)' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
  { symbol: 'SCHB', name: 'Schwab U.S. Broad Market ETF' },
  { symbol: 'FXAIX', name: 'Fidelity 500 Index Fund' },
  { symbol: 'FZROX', name: 'Fidelity ZERO Total Market Index Fund' },
  { symbol: 'VFIAX', name: 'Vanguard 500 Index Fund Admiral Shares' },
  { symbol: 'VTSAX', name: 'Vanguard Total Stock Market Index Fund Admiral Shares' },
  { symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty BeES' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
  { symbol: 'INFY', name: 'Infosys Ltd.' },
]

export const DEFAULT_SUGGESTION_COUNT = 8
export const MIN_SEARCH_CHARS = 3

export const TICKER_UNIVERSE = tickerUniverse

export function getTickerSuggestions(query, limit = DEFAULT_SUGGESTION_COUNT) {
  const trimmed = query.trim()
  if (!trimmed) {
    return POPULAR_TICKERS.slice(0, limit)
  }

  if (trimmed.length < MIN_SEARCH_CHARS) {
    return []
  }

  const normalized = trimmed.toLowerCase()
  const matches = []
  const seen = new Set()

  for (const ticker of tickerUniverse) {
    const symbol = ticker.symbol?.toLowerCase() ?? ''
    const name = ticker.name?.toLowerCase() ?? ''
    if (symbol.includes(normalized) || name.includes(normalized)) {
      if (!seen.has(ticker.symbol)) {
        matches.push(ticker)
        seen.add(ticker.symbol)
      }
    }
    if (matches.length >= limit) {
      break
    }
  }

  return matches
}
