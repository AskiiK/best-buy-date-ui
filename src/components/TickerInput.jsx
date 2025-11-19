function TickerInput({
  value,
  onChange,
  suggestions = [],
  onPickSuggestion,
  disabled = false,
  minSearchChars = 3,
  showMinCharsHint = false,
  showNoMatches = false,
  directoryStatus = 'idle',
  directoryError = '',
}) {
  return (
    <div className="form-control">
      <label className="field-label" htmlFor="ticker">
        Ticker symbol
      </label>
      <input
        id="ticker"
        name="ticker"
        className="text-input"
        placeholder="e.g. RELIANCE"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck="false"
        disabled={disabled}
      />
      {showMinCharsHint ? (
        <p className="input-hint">
          Type at least {minSearchChars} characters to search the directory.
        </p>
      ) : null}
      {!showMinCharsHint && showNoMatches ? (
        <p className="input-hint input-hint--muted">No tickers found.</p>
      ) : null}
      {directoryStatus === 'loading' ? (
        <p className="input-hint input-hint--muted">Loading NSE ticker directory…</p>
      ) : null}
      {directoryStatus === 'error' && !showMinCharsHint ? (
        <p className="input-hint input-hint--muted">
          {directoryError || 'Unable to refresh NSE tickers. Showing the offline list.'}
        </p>
      ) : null}
      {!showMinCharsHint && suggestions.length > 0 ? (
        <div className="suggestions" aria-live="polite">
          <p className="suggestions__title">Popular tickers</p>
          <div className="suggestions__list">
            {suggestions.map((item) => (
              <button
                key={item.symbol}
                type="button"
                className="suggestion"
                onClick={() => onPickSuggestion(item.symbol)}
                disabled={disabled}
              >
                <span className="suggestion__symbol">{item.symbol}</span>
                <span className="suggestion__name">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default TickerInput
