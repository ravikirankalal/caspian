import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onFocus?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder, onFocus }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none border rounded-md p-2 min-h-[100px]',
      },
    },
  });

  return (
    <EditorContent editor={editor} onFocus={onFocus} />
  );
};

export default RichTextEditor;
