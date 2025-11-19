import { normalizeTickerSymbol } from './tickers.js'

const DEFAULT_NEWS_LIMIT = 6
const NEWS_PROXY_URL = (import.meta.env.VITE_NEWS_PROXY_URL || '').trim()

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value)

const getBaseUrl = () => {
  if (isAbsoluteUrl(NEWS_PROXY_URL)) {
    return NEWS_PROXY_URL
  }

  const fallbackOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost'

  return new URL(NEWS_PROXY_URL || '/api/ticker-news', fallbackOrigin).toString()
}

const ensureProxyConfigured = () => {
  if (!NEWS_PROXY_URL) {
    throw new Error(
      'News proxy URL is not configured. Set VITE_NEWS_PROXY_URL to enable headlines.',
    )
  }
}

const buildRequestUrl = (symbol, limit) => {
  const base = getBaseUrl()
  const url = new URL(base)
  url.searchParams.set('ticker', symbol)
  url.searchParams.set('limit', String(limit))
  return url.toString()
}

export const hasNewsProxyConfigured = Boolean(NEWS_PROXY_URL)

export async function fetchTickerNews(
  symbol,
  { limit = DEFAULT_NEWS_LIMIT, signal } = {},
) {
  ensureProxyConfigured()

  const cleanedSymbol = normalizeTickerSymbol(symbol)
  if (!cleanedSymbol) {
    return []
  }

  const requestUrl = buildRequestUrl(cleanedSymbol, limit)
  const response = await fetch(requestUrl, { signal })

  if (!response.ok) {
    throw new Error('Unable to fetch news headlines right now.')
  }

  const data = await response.json()
  if (Array.isArray(data?.items)) {
    return data.items
  }

  return []
}
