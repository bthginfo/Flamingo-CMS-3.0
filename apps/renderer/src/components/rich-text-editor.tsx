'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading2, Heading3, Link as LinkIcon, Undo, Redo } from 'lucide-react';
import { useEffect, useRef } from 'react';

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt('URL eingeben:', editor.getAttributes('link').href || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btn = (active: boolean) =>
    `p-1.5 rounded transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700'}`;

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-200 px-2 py-1.5 bg-zinc-50 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}><Bold size={15} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}><Italic size={15} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))}><UnderlineIcon size={15} /></button>
      <div className="w-px h-5 bg-zinc-200 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}><Heading2 size={15} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))}><Heading3 size={15} /></button>
      <div className="w-px h-5 bg-zinc-200 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}><List size={15} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}><ListOrdered size={15} /></button>
      <div className="w-px h-5 bg-zinc-200 mx-1" />
      <button type="button" onClick={setLink} className={btn(editor.isActive('link'))}><LinkIcon size={15} /></button>
      <div className="w-px h-5 bg-zinc-200 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-1.5 rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"><Undo size={15} /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-1.5 rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"><Redo size={15} /></button>
    </div>
  );
}

export function RichTextEditorField({ label, value, onChange }: { label: string; value: string; onChange: (html: string) => void }) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => {
      onChangeRef.current(e.getHTML());
    },
  });

  // Sync external value changes (e.g. on initial load or reset)
  const initialRef = useRef(true);
  useEffect(() => {
    if (initialRef.current) { initialRef.current = false; return; }
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div>
      <label className="text-xs font-medium text-zinc-600 mb-1 block">{label}</label>
      <div className="border border-zinc-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="prose prose-sm max-w-none p-3 min-h-[200px] focus:outline-none [&_.tiptap]:outline-none [&_.tiptap]:min-h-[180px]" />
      </div>
    </div>
  );
}
