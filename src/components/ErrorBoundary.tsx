import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="border-2 border-border bg-card p-8 max-w-md">
            <h1 className="text-3xl font-extrabold text-foreground mb-3">Something broke.</h1>
            <p className="text-muted-foreground mb-6">{this.state.message ?? "Unexpected error."}</p>
            <button
              type="button"
              className="border-2 border-border bg-primary text-primary-foreground font-bold px-6 py-3 active:scale-[0.97] transition-transform duration-150"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
