import React, { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";

const editorOptions = {
  fontSize: 18,
  theme: "vs-dark",
  automaticLayout: true,
  codeLens: false,
  minimap: {
    enabled: false,
  },
};

const Output = ({ model }) => {
  const onEditorMounted = (editor) => {
    console.log("Output mounted");
  };

  return (
    <div className="editorWrapper">
      <MonacoEditor
        options={{ ...editorOptions, model }}
        editorDidMount={onEditorMounted}
        language="javascript"
      />
    </div>
  );
};

export { Output };
