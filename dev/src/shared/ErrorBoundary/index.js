import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prevState => {
      return {
        ...prevState,
        error: error,
        errorInfo: errorInfo
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center">
          <h2>Oops...something went wrong.</h2>
          <p>Please let your friendly ROKR dev team know about the error:</p>
          <div className="mt-3">
            <code>
              {this.state.error}
            </code>
          </div>
          <div className="mt-3">
            <code>
              {this.state.errorInfo}
            </code>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}