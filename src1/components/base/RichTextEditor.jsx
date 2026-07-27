import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

const DEFAULT_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    [{ align: [] }],
    ['clean'],
  ],
};

const DEFAULT_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'blockquote',
  'link',
  'align',
];

const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  className = '',
  editorKey,
  readOnly = false,
  minHeight = 320,
}) => {
  const modules = useMemo(() => DEFAULT_MODULES, []);

  return (
    <div
      className={`rich-text-editor${className ? ` ${className}` : ''}`}
      style={{ '--rte-min-height': `${minHeight}px` }}
    >
      <ReactQuill
        key={editorKey}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={DEFAULT_FORMATS}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default RichTextEditor;
