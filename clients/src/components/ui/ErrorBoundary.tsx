import { Component, ReactNode } from "react";
import RefreshButton from "../buttons/RefreshButton";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Error: <span className="errors">{this.state.message}</span><RefreshButton /></div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
