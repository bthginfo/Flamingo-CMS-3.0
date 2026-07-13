import type { CSSProperties, ReactNode } from 'react';

const workspaceStyle = {
  '--editor-action-bar-height': '5rem',
  paddingBottom: 'calc(var(--editor-action-bar-height) + env(safe-area-inset-bottom) + 1rem)',
  scrollPaddingBottom: 'calc(var(--editor-action-bar-height) + env(safe-area-inset-bottom) + 1rem)',
} as CSSProperties;

export function EditorWorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="[&_button]:scroll-mb-28 [&_input]:scroll-mb-28 [&_select]:scroll-mb-28 [&_textarea]:scroll-mb-28"
      style={workspaceStyle}
    >
      {children}
    </div>
  );
}
