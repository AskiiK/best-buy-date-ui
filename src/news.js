import { normalizeTickerSymbol } from './tickers.js'

const NEWS_PROXY_BASE = 'https://api.allorigins.win/get?url='
const DEFAULT_NEWS_LIMIT = 6

const sanitizeText = (value) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''

const decodeHtmlEntities = (value) => {
  if (!value) return ''
  const parser = new DOMParser()
  const doc = parser.parseFromString(value, 'text/html')
  return doc.documentElement?.textContent?.trim() ?? ''
}

const extractTextContent = (element, selector) =>
  element.querySelector(selector)?.textContent ?? ''

const buildRssUrl = (symbol) => {
  const cleaned = normalizeTickerSymbol(symbol)
  if (!cleaned) {
    return ''
  }
  const query = encodeURIComponent(`${cleaned} NSE stock`)
  return `https://www.bing.com/news/search?q=${query}&format=RSS&setmkt=en-IN&setlang=en-US`
}

export async function fetchTickerNews(
  symbol,
  { limit = DEFAULT_NEWS_LIMIT, signal } = {},
) {
  const rssUrl = buildRssUrl(symbol)
  if (!rssUrl) {
    return []
  }

  const proxiedUrl = `${NEWS_PROXY_BASE}${encodeURIComponent(rssUrl)}`
  const response = await fetch(proxiedUrl, { signal })

  if (!response.ok) {
    throw new Error('Unable to fetch news headlines right now.')
  }

  const payload = await response.json()
  const contents = payload?.contents
  if (!contents) {
    return []
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(contents, 'text/xml')
  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('Unable to parse the news feed for this ticker.')
  }

  const items = Array.from(doc.querySelectorAll('item')).map((item) => {
    const rawTitle = extractTextContent(item, 'title')
    const rawLink = extractTextContent(item, 'link')
    const rawDescription = extractTextContent(item, 'description')
    const rawPublisher =
      extractTextContent(item, 'source') ||
      extractTextContent(item, 'News\\:Source')
    const rawPublishedAt = extractTextContent(item, 'pubDate')

    return {
      title: sanitizeText(rawTitle),
      url: rawLink.trim(),
      summary: decodeHtmlEntities(rawDescription),
      publisher: sanitizeText(rawPublisher),
      published_at: sanitizeText(rawPublishedAt),
    }
  })

  return items
    .filter((entry) => entry.title && entry.url)
    .slice(0, limit)
}
