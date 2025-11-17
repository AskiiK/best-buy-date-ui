const ASSET_OPTIONS = [
  { value: 'stock', label: 'Stock' },
  { value: 'mutual_fund', label: 'Mutual Fund' },
]

function AssetSelector({ value, onChange }) {
  return (
    <div className="form-control">
      <label className="field-label" htmlFor="assetType">
        Asset type
      </label>
      <div className="asset-selector" id="assetType">
        {ASSET_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`pill ${value === option.value ? 'pill--active' : ''}`}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AssetSelector
