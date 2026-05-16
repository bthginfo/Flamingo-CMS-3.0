'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

function MiniBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt('URL eingeben:', editor.getAttributes('link').href || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btn = (active: boolean) =>
    `p-1 rounded transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'}`;

  return (
    <div className="flex items-center gap-0.5 border-b border-zinc-200 px-2 py-1 bg-zinc-50 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Fett"><Bold size={14} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Kursiv"><Italic size={14} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))} title="Unterstrichen"><UnderlineIcon size={14} /></button>
      <div className="w-px h-4 bg-zinc-200 mx-1" />
      <button type="button" onClick={setLink} className={btn(editor.isActive('link'))} title="Link"><LinkIcon size={14} /></button>
    </div>
  );
}

export function MiniRichTextField({ label, value, onChange }: { label: string; value: string; onChange: (html: string) => void }) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bulletList: false, orderedList: false, codeBlock: false, blockquote: false }),
      Underline,
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => {
      onChangeRef.current(e.getHTML());
    },
  });

  const initialRef = useRef(true);
  useEffect(() => {
    if (initialRef.current) { initialRef.current = false; return; }
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div>
      {label && <span className="text-xs font-medium text-zinc-600 block mb-1">{label}</span>}
      <div className="border border-zinc-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
        <MiniBar editor={editor} />
        <EditorContent editor={editor} className="prose prose-sm max-w-none px-3 py-2 min-h-[80px] focus:outline-none [&_.tiptap]:outline-none [&_.tiptap]:min-h-[60px]" />
      </div>
    </div>
  );
}
