import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '48px',
          fontFamily: 'Syne Mono, monospace',
          color: '#888899',
          fontSize: '13px'
        }}>
          <div style={{ color: '#6C63FF', marginBottom: '8px' }}>
            ZEITGEIST ENGINE — SIGNAL PROCESSING ERROR
          </div>
          <div>{this.state.error?.message || 'Unknown error'}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '24px',
              border: '1px solid #6C63FF',
              background: 'transparent',
              color: '#6C63FF',
              padding: '10px 20px',
              fontFamily: 'Syne Mono, monospace',
              cursor: 'pointer'
            }}
          >
            RESTART ENGINE →
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
