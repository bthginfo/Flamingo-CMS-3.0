'use client';

import React, { Component, type ReactNode } from 'react';

interface Props {
  sectionType: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
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

  render() {
    if (this.state.hasError) {
      return null; // Silently skip broken sections instead of crashing the whole page
    }
    return this.props.children;
  }
}
