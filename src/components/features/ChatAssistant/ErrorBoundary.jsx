import React, { Component } from 'react';
import styles from './ChatAssistant.module.css'; // For styling the error message

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={styles.errorMessageBoundary}>
          <p>Oops! Something went wrong displaying this part.</p>
          {/* Optionally display a generic error message or details in development */}
          {/* process.env.NODE_ENV === 'development' && this.state.error && <p><small>{this.state.error.toString()}</small></p> */}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
