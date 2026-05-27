import { getPublishedBlogPosts } from '@/lib/blog';
import Link from 'next/link';

export async function NewsSection() {
  const posts = await getPublishedBlogPosts(3);
  if (!posts.length) return null;

  return (
    <section className="surface px-6 py-24 md:py-32">
      <div className="container-x">
        <div className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">News</p>
            <h2 className="headline-lg">
              Neues aus dem Studio.<br />
              <em className="italic-pop">Kurz, klar, nützlich.</em>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-lg leading-8 text-muted">
              Gedanken zu Websites, CMS, SEO und den kleinen Entscheidungen, die lokale Marken online stärker machen.
            </p>
            <Link href="/blog" className="mt-5 inline-flex text-sm font-semibold text-[var(--accent-color)]">Alle Beiträge lesen →</Link>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className={`group overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${index === 0 ? 'md:col-span-2' : ''}`}>
              <div className={`relative overflow-hidden bg-[#0b0810] ${index === 0 ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
                {post.coverImage ? <img src={post.coverImage} alt={post.coverAlt || post.title} className="h-full w-full object-cover opacity-88 transition duration-700 group-hover:scale-105" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_25%_25%,#F24171,transparent_35%),linear-gradient(135deg,#0b0810,#241228)]" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/8 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-xs font-medium uppercase tracking-widest text-white/76">
                  {post.category || 'FlamingoMedia'} · {post.readingMinutes} Min
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('de-DE') : 'News'}</p>
                <h3 className="mt-3 font-display text-2xl leading-tight text-slate-950">{post.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
