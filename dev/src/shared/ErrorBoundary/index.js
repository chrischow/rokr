import { Component } from "react";
import './styles.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, };
  }

  static getDerivedStateFromError(error) {
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