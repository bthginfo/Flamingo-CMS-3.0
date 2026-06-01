'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { upload as uploadBlob } from '@vercel/blob/client';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Edit3,
  ExternalLink,
  FileText,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Plus,
  Quote,
  Redo,
  Search,
  Trash2,
  Underline as UnderlineIcon,
  Undo,
  Wand2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { createBlogPost, deleteBlogPost, updateBlogPost, type CrmBlogPost } from './actions';

type Status = 'draft' | 'published' | 'archived';
type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: Status;
  category: string;
  tagsText: string;
  coverImage: string;
  coverAlt: string;
  authorName: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonicalPath: string;
};

const STATUS_LABEL: Record<Status, string> = { draft: 'Entwurf', published: 'Live', archived: 'Archiv' };
const STATUS_CLASS: Record<Status, string> = {
  draft: 'bg-amber-100 text-amber-800',
  published: 'bg-emerald-100 text-emerald-800',
  archived: 'bg-slate-100 text-slate-600',
};
const ALLOWED_IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/avif';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function textFromHtml(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptFrom(value: string, length = 155) {
  const clean = textFromHtml(value)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_`>-]/g, ' ')
    .replace(/\d+\.\s+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > length ? `${clean.slice(0, length - 1).trim()}…` : clean;
}

function fromPost(post?: CrmBlogPost): FormState {
  return {
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    status: (post?.status as Status) || 'draft',
    category: post?.category || 'Websites',
    tagsText: (post?.tags || []).join(', '),
    coverImage: post?.coverImage || '',
    coverAlt: post?.coverAlt || '',
    authorName: post?.authorName || 'FlamingoMedia',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    ogImage: post?.ogImage || '',
    canonicalPath: post?.canonicalPath || '',
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error && error.message ? error.message : 'Die Aktion konnte nicht ausgeführt werden';
}

async function uploadImage(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Bitte eine Bilddatei auswählen.');
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    throw new Error('SVG-Dateien sind aus Sicherheitsgründen nicht als Upload erlaubt. Bitte PNG, WebP, JPG, GIF oder AVIF verwenden.');
  }
  const blob = await uploadBlob(file.name, file, {
    access: 'public',
    handleUploadUrl: '/crm/api/upload',
  });
  return blob.url;
}

export function BlogClient({ initialPosts }: { initialPosts: CrmBlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [editing, setEditing] = useState<CrmBlogPost | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => posts.filter(post => {
    if (status && post.status !== status) return false;
    if (!query) return true;
    const haystack = [post.title, post.excerpt, post.slug, post.category, ...(post.tags || [])].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  }), [posts, query, status]);

  function upsert(post: CrmBlogPost) {
    setPosts(current => current.some(item => item.id === post.id) ? current.map(item => item.id === post.id ? post : item) : [post, ...current]);
  }

  function save(form: FormState, id?: string) {
    startTransition(async () => {
      try {
        const saved = id ? await updateBlogPost(id, form) : await createBlogPost(form);
        upsert(saved);
        setEditing(null);
        setShowNew(false);
        toast.success(saved.status === 'published' ? 'Blogpost veröffentlicht' : 'Blogpost gespeichert');
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  }

  function remove(id: string) {
    if (!confirm('Blogpost wirklich löschen?')) return;
    startTransition(async () => {
      try {
        await deleteBlogPost(id);
        setPosts(current => current.filter(post => post.id !== id));
        toast.success('Blogpost gelöscht');
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">FlamingoMedia</p>
          <h1 className="text-2xl font-bold text-slate-900">Blog & News</h1>
          <p className="mt-1 text-sm text-slate-500">Beiträge schreiben, SEO prüfen und direkt auf der Marketingseite veröffentlichen.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus size={16} /> Neuer Beitrag
        </button>
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-pink-50 to-amber-50 p-5">
        <div className="flex items-start gap-4">
          <div className="hidden rounded-2xl bg-pink-500 p-3 text-white sm:block"><Wand2 size={20} /></div>
          <div>
            <h2 className="font-semibold text-slate-900">SEO ist eingebaut, aber nicht versteckt.</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              Titel, Meta Description, Canonical, OG-Bild, Lesedauer und Schema.org werden automatisch aus dem Beitrag vorbereitet. Du kannst alle SEO-Felder bei Bedarf manuell schärfen.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Titel, Kategorie, Tag suchen..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
          </div>
          <select value={status} onChange={event => setStatus(event.target.value as Status | '')} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">Alle Status</option>
            <option value="draft">Entwurf</option>
            <option value="published">Live</option>
            <option value="archived">Archiv</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map(post => (
            <article key={post.id} className="rounded-xl border border-slate-100 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/20">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASS[post.status as Status]}`}>{STATUS_LABEL[post.status as Status]}</span>
                    {post.category && <span className="text-xs font-medium text-slate-400">{post.category}</span>}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{post.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{post.excerpt}</p>
                  <p className="mt-2 text-xs text-slate-400">/{post.slug} · {post.readingMinutes} Min · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('de-DE') : 'noch nicht veröffentlicht'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {post.status === 'published' && <a href={`/blog/${post.slug}`} target="_blank" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-indigo-700"><ExternalLink size={16} /></a>}
                  <button onClick={() => setEditing(post)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-indigo-700"><Edit3 size={16} /></button>
                  <button onClick={() => remove(post.id)} className="rounded-lg border border-slate-200 p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">Noch keine Beiträge für diese Auswahl.</div>}
      </section>

      {showNew && <BlogModal title="Neuer Blogpost" pending={isPending} onClose={() => setShowNew(false)} onSave={form => save(form)} />}
      {editing && <BlogModal title="Blogpost bearbeiten" post={editing} pending={isPending} onClose={() => setEditing(null)} onSave={form => save(form, editing.id)} />}
    </div>
  );
}

function BlogModal({ title, post, pending, onClose, onSave }: { title: string; post?: CrmBlogPost; pending: boolean; onClose: () => void; onSave: (form: FormState) => void }) {
  const [form, setForm] = useState(() => fromPost(post));
  function patch(next: Partial<FormState>) { setForm(current => ({ ...current, ...next })); }
  function autoSeo() {
    const slug = form.slug || slugify(form.title);
    const excerpt = form.excerpt || excerptFrom(form.content || form.title, 170);
    patch({
      slug,
      excerpt,
      metaTitle: form.metaTitle || form.title.slice(0, 180),
      metaDescription: form.metaDescription || excerptFrom(excerpt || form.content, 165),
      canonicalPath: form.canonicalPath || `/blog/${slug}`,
      coverAlt: form.coverAlt || form.title,
      ogImage: form.ogImage || form.coverImage,
    });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6" onClick={event => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">Schreibe wie in einem normalen Texteditor. Formatierungen, Links und Bilder werden als sauberes HTML im Artikel gespeichert.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            <Field label="Titel *" value={form.title} onChange={value => patch({ title: value, slug: form.slug || slugify(value) })} />
            <Field label="Slug" value={form.slug} onChange={value => patch({ slug: slugify(value), canonicalPath: `/blog/${slugify(value)}` })} />
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Kurzbeschreibung *</span>
              <textarea value={form.excerpt} onChange={event => patch({ excerpt: event.target.value })} className="mt-1 min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <BlogRichTextEditor value={form.content} onChange={value => patch({ content: value })} />
          </div>
          <aside className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Status</span>
              <select value={form.status} onChange={event => patch({ status: event.target.value as Status })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <option value="draft">Entwurf</option>
                <option value="published">Veröffentlicht</option>
                <option value="archived">Archiv</option>
              </select>
            </label>
            <Field label="Kategorie" value={form.category} onChange={value => patch({ category: value })} />
            <Field label="Tags (kommagetrennt)" value={form.tagsText} onChange={value => patch({ tagsText: value })} />
            <ImageUploadInput label="Cover-Bild" value={form.coverImage} onChange={value => patch({ coverImage: value, ogImage: form.ogImage || value })} />
            <Field label="Bild-Alt-Text" value={form.coverAlt} onChange={value => patch({ coverAlt: value })} />
            <Field label="Autor" value={form.authorName} onChange={value => patch({ authorName: value })} />
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">SEO</h3>
                <button onClick={autoSeo} className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-medium text-indigo-700 shadow-sm"><Wand2 size={13} /> auto</button>
              </div>
              <div className="space-y-3">
                <Field label="Meta Title" value={form.metaTitle} onChange={value => patch({ metaTitle: value })} />
                <Field label="Meta Description" value={form.metaDescription} onChange={value => patch({ metaDescription: value })} />
                <ImageUploadInput label="OG-Bild" value={form.ogImage} onChange={value => patch({ ogImage: value })} compact />
                <Field label="Canonical Path" value={form.canonicalPath} onChange={value => patch({ canonicalPath: value })} />
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Abbrechen</button>
          <button onClick={autoSeo} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><FileText size={15} /> SEO-Felder füllen</button>
          <button onClick={() => onSave(form)} disabled={pending || !form.title.trim() || !textFromHtml(form.content).trim()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">Speichern</button>
        </div>
      </div>
    </div>
  );
}

function BlogRichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const onChangeRef = useRef(onChange);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    ],
    content: value || '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[420px] px-4 py-3 text-sm leading-7 text-slate-800 outline-none',
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChangeRef.current(nextEditor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
    }
  }, [value, editor]);

  async function handleBodyImage(file?: File) {
    if (!file || !editor) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const alt = window.prompt('Alt-Text für das Bild', file.name.replace(/\.[^.]+$/, '')) || '';
      editor.chain().focus().setImage({ src: url, alt }).run();
      toast.success('Bild eingefügt');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes('link').href || 'https://';
    const url = window.prompt('URL eingeben:', previous);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  const btn = (active = false) =>
    `inline-flex h-8 items-center justify-center gap-1 rounded-md px-2 text-xs font-medium transition ${active ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-white hover:text-indigo-700'}`;

  return (
    <div>
      <span className="text-xs font-medium text-slate-500">Inhalt *</span>
      <div className="mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50 p-2">
          <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={btn(editor?.isActive('bold'))} title="Fett"><Bold size={14} /></button>
          <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={btn(editor?.isActive('italic'))} title="Kursiv"><Italic size={14} /></button>
          <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={btn(editor?.isActive('underline'))} title="Unterstrichen"><UnderlineIcon size={14} /></button>
          <div className="mx-1 h-5 w-px bg-slate-200" />
          <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor?.isActive('heading', { level: 2 }))} title="Überschrift 2"><Heading2 size={14} /></button>
          <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor?.isActive('heading', { level: 3 }))} title="Überschrift 3"><Heading3 size={14} /></button>
          <div className="mx-1 h-5 w-px bg-slate-200" />
          <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={btn(editor?.isActive('bulletList'))} title="Liste"><List size={14} /></button>
          <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={btn(editor?.isActive('orderedList'))} title="Nummerierte Liste"><ListOrdered size={14} /></button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={btn(editor?.isActive('blockquote'))} title="Zitat"><Quote size={14} /></button>
          <div className="mx-1 h-5 w-px bg-slate-200" />
          <button type="button" onClick={setLink} className={btn(editor?.isActive('link'))} title="Link"><LinkIcon size={14} /></button>
          <input ref={fileRef} type="file" accept={ALLOWED_IMAGE_ACCEPT} className="hidden" onChange={event => handleBodyImage(event.target.files?.[0])} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={btn()} title="Bild hochladen"><ImageIcon size={14} /> {uploading ? 'Upload...' : 'Bild'}</button>
          <div className="mx-1 h-5 w-px bg-slate-200" />
          <button type="button" onClick={() => editor?.chain().focus().undo().run()} className={btn()} title="Rückgängig"><Undo size={14} /></button>
          <button type="button" onClick={() => editor?.chain().focus().redo().run()} className={btn()} title="Wiederholen"><Redo size={14} /></button>
        </div>
        <EditorContent editor={editor} className="blog-editor-content" />
      </div>
      <p className="mt-1 text-xs text-slate-400">Der Beitrag wird als sauberes HTML gespeichert. Cover-Bild und Bilder im Text können direkt hochgeladen werden.</p>
    </div>
  );
}

function ImageUploadInput({ label, value, onChange, compact }: { label: string; value: string; onChange: (value: string) => void; compact?: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success('Bild hochgeladen');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="mt-1 flex gap-2">
        <input value={value} onChange={event => onChange(event.target.value)} placeholder="https://... oder hochladen" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <input ref={fileRef} type="file" accept={ALLOWED_IMAGE_ACCEPT} className="hidden" onChange={event => handleFile(event.target.files?.[0])} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">
          <ImageIcon size={15} />
          {!compact && (uploading ? 'Upload...' : 'Upload')}
        </button>
      </div>
    </label>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="text-xs font-medium text-slate-500">{label}</span><input value={value} onChange={event => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>;
}
