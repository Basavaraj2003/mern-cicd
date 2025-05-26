
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, hasError = false }) => {
  return (
    <div className={`editor-container ${hasError ? 'error' : ''} bg-white rounded-md shadow-sm`}>
      <CodeMirror
        value={code}
        height="400px"
        theme="light"
        extensions={[javascript({ jsx: true, typescript: true })]}
        onChange={onChange}
        className="text-sm"
      />
    </div>
  );
};

export default CodeEditor;
