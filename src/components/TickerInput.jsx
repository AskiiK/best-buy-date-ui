function TickerInput({
  value,
  onChange,
  suggestions = [],
  onPickSuggestion,
  disabled = false,
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
        placeholder="e.g. AAPL"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck="false"
        disabled={disabled}
      />
      {suggestions.length > 0 ? (
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
