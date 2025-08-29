// components/QuillEditor.tsx

import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { QuillToolbar } from "app/(main)/editor/forms/QuillToolbar";
// ...other imports

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder: string;
  activeFormats: string[];
  onFormat: (format: string) => void;
}

const QuillEditor = ({ 
  value, 
  onChange, 
  placeholder,
  activeFormats, // <-- Destructure the new props
  onFormat // <-- Destructure the new props
}: QuillEditorProps) => {
  const modules = {
    toolbar: "#toolbar"
  };
  const formats = [
    "header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "color", "align"
  ];

  return (
    <div>
      {/* 💥 Pass the required props to QuillToolbar */}
      <QuillToolbar onFormat={onFormat} activeFormats={activeFormats} />
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default QuillEditor;