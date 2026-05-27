import type { Metadata } from 'next';
import { getPublishedBlogPosts } from '@/lib/blog';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog: Website, CMS & lokale Sichtbarkeit',
  description: 'FlamingoMedia Blog mit praktischen Gedanken zu Websites, CMS, SEO, Design und digitaler Sichtbarkeit für lokale Unternehmen.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog: Website, CMS & lokale Sichtbarkeit · FlamingoMedia',
    description: 'Praktische Beiträge zu Websites, CMS, SEO, Design und digitaler Sichtbarkeit für lokale Unternehmen.',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'FlamingoMedia Blog',
    url: 'https://www.flamingomedia.online/blog',
    inLanguage: 'de',
    publisher: { '@type': 'Organization', name: 'FlamingoMedia', url: 'https://www.flamingomedia.online' },
    blogPost: posts.slice(0, 12).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      url: `https://www.flamingomedia.online/blog/${post.slug}`,
      datePublished: post.publishedAt?.toISOString(),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden bg-[#0b0810] px-6 pb-20 pt-44 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(242,65,113,0.22),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(255,179,71,0.16),transparent_28%)]" />
        <div className="container-x relative">
          <p className="eyebrow !text-white/65 mb-5">Blog & News</p>
          <h1 className="headline-xl max-w-5xl">
            Ideen für Websites, die auffallen, Vertrauen schaffen und <em className="italic-pop" style={{ color: 'var(--accent-color)' }}>Anfragen bringen.</em>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
            Einblicke aus Projekten, Produktentwicklung und lokalem Marketing: Was gute Websites klarer, schneller und wirksamer macht.
          </p>
        </div>
      </section>

      <section className="surface px-6 py-20 md:py-28">
        <div className="container-x">
          {posts.length === 0 ? (
            <div className="rounded-3xl border border-line bg-white p-10 text-center">
              <p className="font-display text-3xl">Noch keine Beiträge veröffentlicht.</p>
              <p className="mt-3 text-muted">Neue FlamingoMedia News erscheinen hier, sobald sie im CRM live gesetzt sind.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className={`group overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                  <div className={`relative overflow-hidden bg-slate-950 ${index === 0 ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}>
                    {post.coverImage ? <img src={post.coverImage} alt={post.coverAlt || post.title} className="h-full w-full object-cover opacity-88 transition duration-700 group-hover:scale-105" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,#F24171,transparent_35%),linear-gradient(135deg,#0b0810,#241228)]" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/80">
                      {post.category && <span>{post.category}</span>}
                      <span>·</span>
                      <span>{post.readingMinutes} Min</span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="text-xs uppercase tracking-widest text-muted">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('de-DE') : 'News'}</p>
                    <h2 className="mt-3 font-display text-2xl leading-tight text-slate-950 md:text-3xl">{post.title}</h2>
                    <p className="mt-4 text-sm leading-6 text-muted">{post.excerpt}</p>
                    <p className="mt-6 text-sm font-semibold text-[var(--accent-color)]">Beitrag lesen →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
