import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type SectionRevealProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  disabled?: boolean;
};

export function SectionReveal({ children, className, disabled = false, style, ...props }: SectionRevealProps) {
  return (
    <section
      className={`section-reveal${className ? ` ${className}` : ''}`}
      data-revealed="true"
      data-reveal-disabled={disabled ? 'true' : undefined}
      style={style as CSSProperties}
      {...props}
    >
      {children}
    </section>
  );
}
