import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends
  React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // エラー発生時にフォールバック UI を表示
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // ここでログ送信なども可能
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // フォールバック UI
      return (
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-red-600">エラーが発生しました</h1>
          <p className="mt-2">お手数ですが、ページを再読み込みしてください。</p>
        </div>
      );
    }
    // 正常時は子要素をそのまま表示
    return this.props.children;
  }
}