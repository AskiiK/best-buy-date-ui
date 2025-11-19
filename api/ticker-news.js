import { XMLParser } from 'fast-xml-parser'

const DEFAULT_LIMIT = 8
const MAX_LIMIT = 12
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  removeNSPrefix: true,
  textNodeName: 'value',
  trimValues: true,
})

const normalizeTickerSymbol = (value = '') =>
  value && typeof value === 'string' ? value.replace(/\.NS$/i, '').trim().toUpperCase() : ''

const sanitizeText = (value) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').replace(/&#\d+;?/g, '').trim() : ''

const stripHtml = (value) =>
  typeof value === 'string' ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : ''

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const toArray = (value) => {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { ticker = '', symbol = '', limit } = req.query ?? {}
  const normalizedTicker = normalizeTickerSymbol(ticker || symbol)

  if (!normalizedTicker) {
    return res.status(400).json({ error: 'Ticker parameter is required' })
  }

  const parsedLimit = Number.parseInt(limit, 10)
  const finalLimit = Number.isNaN(parsedLimit)
    ? DEFAULT_LIMIT
    : Math.min(Math.max(parsedLimit, 1), MAX_LIMIT)

  const encodedQuery = encodeURIComponent(`${normalizedTicker} NSE stock`)
  const rssUrl = `https://www.bing.com/news/search?q=${encodedQuery}&format=RSS&setmkt=en-IN&setlang=en-US`

  let rssResponse
  try {
    rssResponse = await fetch(rssUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
      },
    })
  } catch (fetchError) {
    return res.status(502).json({ error: 'Unable to reach the news provider.' })
  }

  if (!rssResponse.ok) {
    return res.status(502).json({
      error: 'The news provider returned an unexpected response.',
      status: rssResponse.status,
    })
  }

  const rssBody = await rssResponse.text()
  let parsedFeed
  try {
    parsedFeed = parser.parse(rssBody)
  } catch (parseError) {
    return res.status(500).json({ error: 'Unable to parse the news feed right now.' })
  }

  const items = toArray(parsedFeed?.rss?.channel?.item).filter(Boolean)
  const normalizedItems = items
    .map((item) => ({
      title: sanitizeText(item?.title ?? ''),
      url: sanitizeText(item?.link ?? ''),
      summary: stripHtml(item?.description ?? ''),
      publisher: sanitizeText(item?.source ?? item?.['News:Source'] ?? ''),
      published_at: sanitizeText(item?.pubDate ?? ''),
    }))
    .filter((entry) => entry.title && entry.url)
    .slice(0, finalLimit)

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400')
  return res.status(200).json({ items: normalizedItems })
}
