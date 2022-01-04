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

const Editor = ({ model }) => {
  const [value, updateValue] = useState(model.getValue());

  const updateHash = () => {
    const data = {
      content: value,
    };

    const json = JSON.stringify(data);
    const hash = btoa(json);

    console.log(`updating hash with new state: ${hash}`);
    window.location.hash = hash;
  };

  useEffect(updateHash, [value]);

  const onEditorMounted = (editor) => {
    console.log("Editor mounted");
  };

  const onChange = (newValue) => {
    updateValue(newValue);
    console.log("Changed!", newValue);
  };

  return (
    <div className="editorWrapper">
      <MonacoEditor
        options={{ ...editorOptions }}
        editorDidMount={onEditorMounted}
        onChange={onChange}
        laguage="javascript"
        value={value}
      />
    </div>
  );
};

export { Editor };
