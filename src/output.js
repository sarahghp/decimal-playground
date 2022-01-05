import React, { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { EDITOR_OPTIONS } from "./constants.js";

const editorOptions = {
  ...EDITOR_OPTIONS,
  readOnly: true,
};

const Output = ({ content }) => {
  const onEditorMounted = (editor) => {
    console.log("Output mounted");
  };

  return (
    <div className="editorWrapper">
      <MonacoEditor
        options={editorOptions}
        editorDidMount={onEditorMounted}
        language="javascript"
        value={content}
      />
    </div>
  );
};

export { Output };
