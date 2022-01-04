import React, { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { EDITOR_OPTIONS } from "./constants.js";

const editorOptions = {
  ...EDITOR_OPTIONS,
  readOnly: true,
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
