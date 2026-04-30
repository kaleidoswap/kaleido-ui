import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Render crash:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen bg-background text-foreground font-display flex flex-col items-center justify-center p-6 gap-4">
            <span className="material-symbols-outlined text-danger text-icon-5xl">error</span>
            <h2 className="text-lg font-bold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground text-center">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                this.props.onReset?.()
              }}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
            >
              Try Again
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
