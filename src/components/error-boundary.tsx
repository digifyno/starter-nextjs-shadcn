'use client';
import { Component, createRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props { children: ReactNode; fallback?: ReactNode; onReset?: () => void; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  private containerRef = createRef<HTMLDivElement>();
  private contentRef = createRef<HTMLDivElement>();

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, info.componentStack);
    }
  }

  componentDidMount() {
    if (this.state.hasError) {
      this.containerRef.current?.focus();
    }
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (!prevState.hasError && this.state.hasError) {
      this.containerRef.current?.focus();
    }
    if (prevState.hasError && !this.state.hasError) {
      this.contentRef.current?.focus();
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          ref={this.containerRef}
          role="alert"
          tabIndex={-1}
          className="flex min-h-screen flex-col items-center justify-center gap-4 p-8"
        >
          <p className="text-lg font-medium">Something went wrong.</p>
          <Button onClick={this.reset}>
            Try again
          </Button>
        </div>
      );
    }
    return (
      <div ref={this.contentRef} tabIndex={-1}>
        {this.props.children}
      </div>
    );
  }
}
