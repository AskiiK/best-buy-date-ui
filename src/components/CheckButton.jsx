function CheckButton({ disabled, loading }) {
  return (
    <button
      type="submit"
      className="primary-button"
      disabled={disabled || loading}
    >
      {loading ? 'Finding the best buy date…' : 'Find the best buy date'}
    </button>
  )
}

export default CheckButton
