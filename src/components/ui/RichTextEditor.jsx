import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import EmojiPicker from 'emoji-picker-react';

function getTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return 'dark';
  if (attr === 'light') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

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

function LinkPopup({ href, onApply, onRemove, onClose }) {
  const [url, setUrl] = useState(href || '');
  const inputRef = useRef(null);

  useEffect(() => {
    // Small delay so mousedown event that opened us doesn't immediately close
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, []);

  const apply = () => {
    const trimmed = url.trim();
    if (!trimmed) { onRemove(); return; }
    const href = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    onApply(href);
  };

  return (
    <div className="rte-link-popup">
      <input
        ref={inputRef}
        type="url"
        className="rte-link-input"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); apply(); }
          if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
        }}
      />
      <button
        type="button"
        className="rte-link-btn rte-link-apply"
        onMouseDown={(e) => { e.preventDefault(); apply(); }}
      >
        Apply
      </button>
      {href && (
        <button
          type="button"
          className="rte-link-btn rte-link-remove"
          onMouseDown={(e) => { e.preventDefault(); onRemove(); }}
        >
          Remove
        </button>
      )}
    </div>
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
  const [emojiPos, setEmojiPos] = useState(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const emojiTriggerRef = useRef(null);
  const emojiPanelRef = useRef(null);
  const linkWrapRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
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
        autolink: true,
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

  // Close emoji picker on outside click (fixed panel + trigger button)
  useEffect(() => {
    if (!emojiOpen) return;
    const handler = (e) => {
      const inTrigger = emojiTriggerRef.current?.contains(e.target);
      const inPanel = emojiPanelRef.current?.contains(e.target);
      if (!inTrigger && !inPanel) setEmojiOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [emojiOpen]);

  // Close link popup on outside click
  useEffect(() => {
    if (!linkOpen) return;
    const handler = (e) => {
      if (linkWrapRef.current && !linkWrapRef.current.contains(e.target)) {
        setLinkOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [linkOpen]);

  const openEmoji = () => {
    if (!emojiOpen) {
      const rect = emojiTriggerRef.current?.getBoundingClientRect();
      if (rect) {
        // Default: open below-left of trigger. If too close to right edge, flip left.
        const panelWidth = 300;
        const spaceRight = window.innerWidth - rect.left;
        const left = spaceRight < panelWidth + 8 ? rect.right - panelWidth : rect.left;
        setEmojiPos({ top: rect.bottom + 4, left });
      }
    }
    setEmojiOpen((v) => !v);
    setLinkOpen(false);
  };

  const openLink = useCallback(() => {
    if (!editor) return;
    setLinkOpen((v) => !v);
    setEmojiOpen(false);
  }, [editor]);

  const applyLink = useCallback((href) => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setLinkOpen(false);
  }, [editor]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkOpen(false);
  }, [editor]);

  const onEmojiClick = (emojiData) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emojiData.emoji).run();
    setEmojiOpen(false);
  };

  if (!editor) return null;

  const currentHref = editor.getAttributes('link').href || '';
  const theme = getTheme();

  return (
    <div className={`rte-wrap${slim ? ' rte-slim' : ''}`}>
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

        {/* Link button + inline popup */}
        <div className="rte-link-wrap" ref={linkWrapRef}>
          <ToolbarBtn
            onClick={openLink}
            active={editor.isActive('link') || linkOpen}
            title="Insert link"
          >
            🔗
          </ToolbarBtn>
          {linkOpen && (
            <LinkPopup
              href={currentHref}
              onApply={applyLink}
              onRemove={removeLink}
              onClose={() => setLinkOpen(false)}
            />
          )}
        </div>

        {/* Emoji button — panel uses fixed positioning to escape overflow clips */}
        <div className="rte-emoji-wrap">
          <button
            ref={emojiTriggerRef}
            type="button"
            className={`rte-btn${emojiOpen ? ' rte-btn-active' : ''}`}
            onMouseDown={(e) => { e.preventDefault(); openEmoji(); }}
            title="Insert emoji"
            aria-label="Insert emoji"
            aria-pressed={emojiOpen}
          >
            😊
          </button>
        </div>
      </div>

      <EditorContent editor={editor} className="rte-editor-wrap" />

      {/* Emoji panel rendered at document body level via fixed position */}
      {emojiOpen && emojiPos && (
        <div
          ref={emojiPanelRef}
          className="rte-emoji-panel-fixed"
          style={{ top: emojiPos.top, left: emojiPos.left }}
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            skinTonesDisabled
            searchDisabled={slim}
            height={slim ? 320 : 400}
            width={300}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
}
