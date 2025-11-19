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

const extractNewsDateValue = (item) =>
  item?.published_at ??
  item?.publishedAt ??
  item?.published ??
  item?.providerPublishTime ??
  item?.date ??
  item?.time

const formatNewsDate = (value) => {
  if (value === undefined || value === null || value === '') {
    return ''
  }

  let date
  if (typeof value === 'number') {
    const milliseconds = value > 1e12 ? value : value * 1000
    date = new Date(milliseconds)
  } else if (typeof value === 'string' && value.trim() !== '') {
    const numeric = Number(value)
    if (!Number.isNaN(numeric)) {
      const milliseconds = numeric > 1e12 ? numeric : numeric * 1000
      date = new Date(milliseconds)
    } else {
      date = new Date(value)
    }
  }

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getNewsTitle = (item) =>
  item?.title || item?.headline || item?.summary || 'Untitled story'

const getNewsSummary = (item) => item?.summary || item?.description || ''

const getNewsPublisher = (item) => item?.publisher || item?.source || item?.provider || ''

const getNewsUrl = (item) => item?.url || item?.link || item?.article_url || ''

function ResultsTable({ result, lastQuery }) {
  if (!result) {
    return null
  }

  const { news: rawNews = [], ...rest } = result
  const entries = Object.entries(rest)
  const newsItems = Array.isArray(rawNews) ? rawNews : []

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
      <div className="news">
        <div className="news__header">
          <p className="eyebrow">News</p>
          <h3>Latest headlines</h3>
        </div>
        {newsItems.length > 0 ? (
          <ul className="news__list">
            {newsItems.map((item, index) => {
              const title = getNewsTitle(item)
              const summary = getNewsSummary(item)
              const publisher = getNewsPublisher(item)
              const publishedAt = formatNewsDate(extractNewsDateValue(item))
              const url = getNewsUrl(item)
              const key = url || `${title}-${index}`

              return (
                <li key={key} className="news-card">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="news-card__title"
                    >
                      {title}
                    </a>
                  ) : (
                    <p className="news-card__title">{title}</p>
                  )}
                  {summary ? <p className="news-card__summary">{summary}</p> : null}
                  {publisher || publishedAt ? (
                    <p className="news-card__meta">
                      {publisher ? <span>{publisher}</span> : null}
                      {publisher && publishedAt ? (
                        <span className="news-card__meta-separator">•</span>
                      ) : null}
                      {publishedAt ? <span>{publishedAt}</span> : null}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="news__empty">
            No recent headlines were returned for this ticker. Try again later for new stories.
          </p>
        )}
      </div>
    </section>
  )
}

export default ResultsTable
