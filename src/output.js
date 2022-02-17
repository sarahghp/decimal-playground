import React, { useEffect, useRef } from "react";
import MonacoEditor from "react-monaco-editor";
import { EDITOR_OPTIONS } from "./constants.js";

const editorOptions = {
  ...EDITOR_OPTIONS,
  readOnly: true,
};

const Output = ({ content, orderClass }) => {
  const outputEditor = useRef(null);

  useEffect(() => {
    outputEditor.current.editor.setSelection({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 1,
    });
  }, [content]);

  return (
    <div className={`editorWrapper ${orderClass}`}>
      <MonacoEditor
        ref={outputEditor}
        options={editorOptions}
        language="javascript"
        value={content}
      />
    </div>
  );
};

export { Output };
