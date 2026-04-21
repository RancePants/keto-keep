import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import EmojiPicker from 'emoji-picker-react';

const SLIM_TOOLBAR = false; // full toolbar by default; pass slim={true} for replies

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      className={`rte-btn${active ? ' rte-btn-active' : ''}`}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      aria-label={title}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Write something…',
  slim = false,
  autoFocus = false,
}) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const emojiRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable extensions we don't use to keep it lean
        blockquote: false,
        code: false,
        codeBlock: false,
        hardBreak: false,
        heading: false,
        horizontalRule: false,
        strike: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
    ],
    content,
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: 'rte-content',
        'data-placeholder': placeholder,
      },
    },
    onUpdate({ editor: ed }) {
      if (onChange) onChange(ed.getHTML());
    },
  });

  // Sync content when prop changes externally (e.g. cancel + re-open edit)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== content) {
      editor.commands.setContent(content, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!emojiOpen) return;
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [emojiOpen]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL', prev);
    if (url === null) return;
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    const href = url.startsWith('http') ? url : `https://${url}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
  }, [editor]);

  const onEmojiClick = (emojiData) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setEmojiOpen(false);
  };

  if (!editor) return null;

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarBtn>
        {!slim && (
          <>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet list"
            >
              ≡
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Numbered list"
            >
              1.
            </ToolbarBtn>
          </>
        )}
        <ToolbarBtn
          onClick={setLink}
          active={editor.isActive('link')}
          title="Insert link"
        >
          🔗
        </ToolbarBtn>
        <div className="rte-emoji-wrap" ref={emojiRef}>
          <ToolbarBtn
            onClick={() => setEmojiOpen((v) => !v)}
            active={emojiOpen}
            title="Insert emoji"
          >
            😊
          </ToolbarBtn>
          {emojiOpen && (
            <div className="rte-emoji-panel">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                skinTonesDisabled
                searchDisabled={slim}
                height={slim ? 320 : 400}
                width={300}
              />
            </div>
          )}
        </div>
      </div>
      <EditorContent editor={editor} className="rte-editor-wrap" />
    </div>
  );
}
