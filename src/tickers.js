import tickerUniverse from './data/tickers.json'

export const POPULAR_TICKERS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
  { symbol: 'INFY', name: 'Infosys Ltd.' },
  { symbol: 'ITC', name: 'ITC Ltd.' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.' },
  { symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty BeES' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd.' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.' },
]

export const DEFAULT_SUGGESTION_COUNT = 8
export const MIN_SEARCH_CHARS = 3

export const TICKER_UNIVERSE = tickerUniverse

export function normalizeTickerSymbol(symbol = '') {
  if (typeof symbol !== 'string') {
    return ''
  }
  return symbol.replace(/\.NS$/i, '').trim()
}

export function getTickerSuggestions(
  query,
  limit = DEFAULT_SUGGESTION_COUNT,
  { universe = tickerUniverse, popular = POPULAR_TICKERS } = {},
) {
  const trimmed = query.trim()
  if (!trimmed) {
    return popular.slice(0, limit)
  }

  if (trimmed.length < MIN_SEARCH_CHARS) {
    return []
  }

  const normalized = trimmed.toLowerCase()
  const matches = []
  const seen = new Set()

  for (const ticker of universe) {
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
