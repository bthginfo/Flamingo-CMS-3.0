import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedBlogPost } from '@/lib/blog';

type Params = { slug: string };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return { title: 'Blogpost nicht gefunden', robots: { index: false, follow: false } };
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const image = post.ogImage || post.coverImage || '/og-image.svg';
  return {
    title,
    description,
    alternates: { canonical: post.canonicalPath || `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.authorName],
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.ogImage || post.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: { '@type': 'Organization', name: post.authorName || 'FlamingoMedia' },
    publisher: {
      '@type': 'Organization',
      name: 'FlamingoMedia',
      logo: { '@type': 'ImageObject', url: 'https://www.flamingomedia.online/brand/flamingo-full-beside.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.flamingomedia.online/blog/${post.slug}` },
    keywords: post.tags?.join(', '),
    inLanguage: 'de',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="bg-[#fff8fa]">
        <header className="relative overflow-hidden bg-[#0b0810] px-6 pb-16 pt-40 text-white md:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(242,65,113,0.26),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(255,179,71,0.18),transparent_28%)]" />
          <div className="container-x relative grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <Link href="/blog" className="text-sm text-white/65 hover:text-white">← Alle Beiträge</Link>
              <p className="mt-10 text-xs uppercase tracking-[0.22em] text-white/60">
                {post.category || 'FlamingoMedia'} · {post.readingMinutes} Min · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('de-DE') : 'News'}
              </p>
              <h1 className="mt-5 max-w-5xl font-display text-5xl font-bold leading-[0.95] md:text-7xl">{post.title}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/74">{post.excerpt}</p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
              {post.coverImage ? <img src={post.coverImage} alt={post.coverAlt || post.title} className="aspect-[4/3] w-full object-cover" /> : <div className="aspect-[4/3] bg-[radial-gradient(circle_at_30%_30%,#F24171,transparent_35%),linear-gradient(135deg,#15111c,#2b1522)]" />}
            </div>
          </div>
        </header>
        <div className="container-x grid gap-10 px-6 py-16 lg:grid-cols-[220px_1fr_220px]">
          <aside className="hidden text-sm text-muted lg:block">
            <p className="font-semibold text-slate-900">Autor</p>
            <p className="mt-2">{post.authorName}</p>
            {post.tags?.length ? <div className="mt-8 flex flex-wrap gap-2">{post.tags.map(tag => <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs shadow-sm">{tag}</span>)}</div> : null}
          </aside>
          <div className="min-w-0 rounded-[2rem] bg-white p-6 shadow-sm md:p-12">
            <BlogContent content={post.content} />
          </div>
          <aside className="hidden lg:block" />
        </div>
      </article>
    </>
  );
}

function BlogContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
  return (
    <div className="prose-blog">
      {blocks.map((block, index) => {
        if (block.startsWith('### ')) return <h3 key={index}>{renderInline(block.slice(4))}</h3>;
        if (block.startsWith('## ')) return <h2 key={index}>{renderInline(block.slice(3))}</h2>;

        const image = block.match(/^!\[([^\]]*)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)$/);
        if (image) {
          return (
            <figure key={index}>
              <img src={image[2]} alt={image[1]} />
              {image[1] && <figcaption>{image[1]}</figcaption>}
            </figure>
          );
        }

        if (block.split('\n').every(line => /^\d+\.\s+/.test(line.trim()))) {
          return <ol key={index}>{block.split('\n').map((line, itemIndex) => <li key={`${index}-${itemIndex}`}>{renderInline(line.trim().replace(/^\d+\.\s+/, ''))}</li>)}</ol>;
        }

        if (block.split('\n').every(line => line.trim().startsWith('- '))) {
          return <ul key={index}>{block.split('\n').map((line, itemIndex) => <li key={`${index}-${itemIndex}`}>{renderInline(line.trim().replace(/^- /, ''))}</li>)}</ul>;
        }

        if (block.split('\n').every(line => line.trim().startsWith('> '))) {
          return <blockquote key={index}>{block.split('\n').map(line => line.trim().replace(/^> /, '')).map((line, lineIndex) => <p key={lineIndex}>{renderInline(line)}</p>)}</blockquote>;
        }

        return <p key={index}>{renderInline(block)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

    if (match[2] && match[3]) {
      const href = match[3];
      const external = href.startsWith('http');
      parts.push(<a key={match.index} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{match[2]}</a>);
    } else if (match[4]) {
      parts.push(<strong key={match.index}>{match[4]}</strong>);
    } else if (match[5]) {
      parts.push(<em key={match.index}>{match[5]}</em>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
