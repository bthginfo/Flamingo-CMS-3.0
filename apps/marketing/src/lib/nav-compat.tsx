'use client';

/**
 * Navigation compatibility layer — provides Link/NavLink/useLocation
 * using Next.js App Router primitives instead of react-router-dom.
 */

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';

type LinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, children, className, onClick, style, ...rest },
  ref
) {
  return (
    <NextLink href={to} className={className} onClick={onClick} style={style} ref={ref} {...rest}>
      {children}
    </NextLink>
  );
});

type NavLinkProps = {
  to: string;
  children: ReactNode | ((props: { isActive: boolean }) => ReactNode);
  className?: string | ((props: { isActive: boolean }) => string);
};

export function NavLink({ to, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === to;
  const cls = typeof className === 'function' ? className({ isActive }) : className;
  const content = typeof children === 'function' ? children({ isActive }) : children;
  return (
    <NextLink href={to} className={cls || undefined}>
      {content}
    </NextLink>
  );
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname };
}

// No-ops for compatibility
export function Outlet() { return null; }
export function Routes({ children }: { children: ReactNode }) { return <>{children}</>; }
export function Route(_: any) { return null; }
