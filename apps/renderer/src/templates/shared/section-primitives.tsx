import type { HTMLAttributes, ReactNode } from 'react';
import { AlertCircle, ArrowRight, Inbox, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { safeContentUrl } from '@/lib/safe-content-url';

export type SectionAction = {
  label?: string;
  href?: string;
};

type SectionHeaderProps = {
  eyebrow?: string;
  headline?: ReactNode;
  subline?: string;
  align?: 'start' | 'center';
  size?: 'compact' | 'default' | 'display';
  eyebrowPath?: string;
  headlinePath?: string;
  sublinePath?: string;
  richSubline?: boolean;
  titleAs?: 'h1' | 'h2';
  className?: string;
};

export function PremiumSectionHeader({
  eyebrow,
  headline,
  subline,
  align = 'start',
  size = 'default',
  eyebrowPath = 'badgeText',
  headlinePath = 'headline',
  sublinePath = 'subline',
  richSubline = true,
  titleAs = 'h2',
  className,
}: SectionHeaderProps) {
  if (!eyebrow && !headline && !subline) return null;
  const Title = titleAs;

  return (
    <header
      className={cn(
        'cms-section-header',
        align === 'center' && 'cms-section-header--center',
        size === 'compact' && 'cms-section-header--compact',
        size === 'display' && 'cms-section-header--display',
        className,
      )}
    >
      {eyebrow && (
        <p className="cms-eyebrow" data-edit-path={eyebrowPath}>
          <span aria-hidden="true" className="cms-eyebrow-mark" />
          {eyebrow}
        </p>
      )}
      {headline && <Title className="cms-section-title" data-edit-path={headlinePath}>{headline}</Title>}
      {subline && richSubline ? (
        <div
          className="cms-section-copy rt-content"
          data-edit-rich={sublinePath}
          dangerouslySetInnerHTML={{ __html: subline }}
        />
      ) : subline ? (
        <p className="cms-section-copy" data-edit-path={sublinePath}>{subline}</p>
      ) : null}
    </header>
  );
}

export function ActionLink({
  action,
  tone = 'primary',
  editKey = 'cta',
  showArrow = true,
  className,
}: {
  action: SectionAction;
  tone?: 'primary' | 'secondary';
  editKey?: string;
  showArrow?: boolean;
  className?: string;
}) {
  const href = safeContentUrl(action.href || '');
  if (!action.label || !href) return null;

  return (
    <a
      data-edit-link={editKey}
      href={href}
      className={cn('cms-button', `cms-button--${tone}`, className)}
    >
      <span data-edit-path="label">{action.label}</span>
      {showArrow && <ArrowRight aria-hidden="true" size={17} className="cms-button-icon" />}
    </a>
  );
}

export function ActionGroup({ children, align = 'start', className }: { children: ReactNode; align?: 'start' | 'center'; className?: string }) {
  return <div className={cn('cms-action-group', align === 'center' && 'cms-action-group--center', className)}>{children}</div>;
}

export function CardSurface({
  as = 'div',
  interactive = false,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'aside';
  interactive?: boolean;
  children: ReactNode;
}) {
  const Component = as;
  return (
    <Component
      className={cn('cms-card', interactive && 'cms-card--interactive', className)}
      data-card=""
      {...props}
    >
      {children}
    </Component>
  );
}

export function MediaFrame({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={cn('cms-media-frame', className)} {...props}>{children}</div>;
}

export function FormField({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const message = error || hint;
  return (
    <div className={cn('cms-form-field', className)} data-invalid={error ? 'true' : undefined}>
      <label className="cms-form-label text-[color:var(--token-label)]" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true" className="cms-form-required"> *</span>}
      </label>
      {children}
      {message && (
        <p className="cms-form-message" id={`${id}-message`} role={error ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}

export function ResponsiveDataFrame({ children, label, hint = 'Tabelle horizontal wischen' }: { children: ReactNode; label: string; hint?: string }) {
  return (
    <div className="cms-data-frame">
      <p aria-hidden="true" className="cms-data-hint">{hint}</p>
      <div className="cms-data-scroll" role="region" aria-label={label} tabIndex={0}>{children}</div>
    </div>
  );
}

export function SectionState({
  state,
  title,
  message,
}: {
  state: 'loading' | 'empty' | 'error';
  title?: string;
  message?: string;
}) {
  const Icon = state === 'loading' ? LoaderCircle : state === 'error' ? AlertCircle : Inbox;
  const fallbackTitle = state === 'loading' ? 'Wird geladen' : state === 'error' ? 'Das hat nicht funktioniert' : 'Noch keine Inhalte';
  return (
    <div className="cms-section-state" data-state={state} role={state === 'error' ? 'alert' : 'status'} aria-live="polite">
      <Icon aria-hidden="true" className={cn('cms-section-state-icon', state === 'loading' && 'animate-spin')} size={22} />
      <div>
        <p className="cms-section-state-title">{title || fallbackTitle}</p>
        {message && <p className="cms-section-state-copy">{message}</p>}
      </div>
    </div>
  );
}
