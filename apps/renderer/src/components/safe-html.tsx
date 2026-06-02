import { sanitizeHtml } from '@/lib/sanitize-html';

type SafeHtmlProps = {
  html?: string | null;
  as?: 'div' | 'span' | 'p' | 'section';
  className?: string;
};

export function SafeHtml({ html, as: Tag = 'div', className }: SafeHtmlProps) {
  if (!html) return null;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}
