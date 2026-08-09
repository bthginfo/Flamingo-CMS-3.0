'use client';

import React, { Component, type ReactNode } from 'react';

interface Props {
  sectionType: string;
  resetKey: unknown;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export function shouldResetSectionError(previousResetKey: unknown, resetKey: unknown) {
  return previousResetKey !== resetKey;
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error(`[Section Error] ${this.props.sectionType}:`, error.message);
  }

  componentDidUpdate(previousProps: Props) {
    if (this.state.hasError && shouldResetSectionError(previousProps.resetKey, this.props.resetKey)) {
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      return null; // A changed section payload resets the boundary in componentDidUpdate.
    }
    return this.props.children;
  }
}
