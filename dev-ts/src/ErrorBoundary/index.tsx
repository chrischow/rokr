import { Component } from "react";
import './styles.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

export default class ErrorBoundary extends Component<any, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, };
  }

  static getDerivedStateFromError(error: any) {
    // Update state
    return { hasError: true, error: error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center">
          <h1>Oops...something went wrong.</h1>
          <p>Please let your friendly ROKR dev team know about the error:</p>
          <div className="mt-4 error-div text-start">
            <pre className="text-red">
              {JSON.parse(JSON.stringify(this.state.error.stack))}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}