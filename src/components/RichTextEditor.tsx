import React, { useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Minus, RemoveFormatting } from 'lucide-react';

interface ToolbarBtnProps {
  cmd: string;
  icon: React.ReactNode;
  title: string;
  val?: string;
  onExec: (cmd: string, val?: string) => void;
}

function ToolBtn({ cmd, icon, title, val, onExec }: ToolbarBtnProps) {
  const active = (() => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  })();

  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onExec(cmd, val);
      }}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all text-sm font-medium ${
        active ? 'bg-orange-100 text-orange-600' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
      }`}
    >
      {icon}
    </button>
  );
}

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter description...',
  minHeight = '180px',
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && editorRef.current) {
      editorRef.current.innerHTML = value || '';
      initialized.current = true;
    }
  }, [value]);

  useEffect(() => {
    if (initialized.current && editorRef.current && value === '' && editorRef.current.innerHTML !== '') {
      editorRef.current.innerHTML = '';
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val ?? undefined);
    editorRef.current?.focus();
    setTimeout(handleInput, 0);
  }, [handleInput]);

  const sep = <div className="w-px h-5 bg-slate-200 mx-1" />;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/30 focus-within:border-orange-500 transition-all bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-200 flex-wrap">
        <ToolBtn cmd="bold"                icon={<Bold size={14} />}           title="Bold (Ctrl+B)"           onExec={exec} />
        <ToolBtn cmd="italic"              icon={<Italic size={14} />}         title="Italic (Ctrl+I)"         onExec={exec} />
        <ToolBtn cmd="underline"           icon={<Underline size={14} />}      title="Underline (Ctrl+U)"      onExec={exec} />
        {sep}
        <ToolBtn cmd="insertUnorderedList" icon={<List size={14} />}           title="Bullet List"             onExec={exec} />
        <ToolBtn cmd="insertOrderedList"   icon={<ListOrdered size={14} />}    title="Numbered List"           onExec={exec} />
        {sep}
        <button
          type="button"
          title="Indent"
          onMouseDown={(e) => { e.preventDefault(); exec('indent'); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all text-xs font-bold"
        >→</button>
        <button
          type="button"
          title="Outdent"
          onMouseDown={(e) => { e.preventDefault(); exec('outdent'); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all text-xs font-bold"
        >←</button>
        {sep}
        <button
          type="button"
          title="Insert horizontal line"
          onMouseDown={(e) => { e.preventDefault(); exec('insertHorizontalRule'); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all"
        >
          <Minus size={14} />
        </button>
        <button
          type="button"
          title="Clear formatting"
          onMouseDown={(e) => { e.preventDefault(); exec('removeFormat'); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <RemoveFormatting size={14} />
        </button>
        <span className="ml-auto text-[10px] text-slate-400 hidden sm:block pr-1">
          Ctrl+B Bold · Ctrl+I Italic · Ctrl+U Underline
        </span>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) e.preventDefault();
        }}
        data-placeholder={placeholder}
        className="rte-content px-4 py-3 text-sm text-slate-800 focus:outline-none leading-relaxed"
        style={{ minHeight }}
      />
    </div>
  );
}
