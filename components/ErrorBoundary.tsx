'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-dark-2 text-white p-6">
          <div className="flex flex-col items-center max-w-md text-center space-y-6">
            <Image 
              src="/icons/call-ended.svg" 
              alt="Error" 
              width={80} 
              height={80}
              className="opacity-50"
            />
            <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
            <p className="text-gray-400">
              We encountered an unexpected error. This might be a temporary issue.
            </p>
            {this.state.error && (
              <details className="mt-4 p-4 bg-dark-1 rounded-lg text-sm text-gray-300 w-full">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap break-words">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={this.handleRetry}
                className="bg-blue-1 hover:bg-blue-600"
              >
                Try Again
              </Button>
              <Button 
                onClick={this.handleReload}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
