import React, { ReactNode } from 'react'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.reset) || (
          <div
            role="alert"
            style={{
              padding: '16px',
              margin: '16px',
              backgroundColor: '#fee',
              border: '1px solid #f99',
              borderRadius: '4px',
              color: '#c33',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0' }}>Something went wrong</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
              {this.state.error.message}
            </p>
            <button
              onClick={this.reset}
              style={{
                padding: '6px 12px',
                backgroundColor: '#c33',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
