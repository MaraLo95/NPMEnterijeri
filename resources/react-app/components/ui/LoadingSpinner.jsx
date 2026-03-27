import './LoadingSpinner.css'

function LoadingSpinner() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <i className="bi bi-box-seam"></i>
        </div>
        <div className="loading-spinner"></div>
        <p className="loading-text">Učitavanje...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner




