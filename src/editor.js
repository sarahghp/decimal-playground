import React from "react";
import MonacoEditor from "react-monaco-editor";
import { monaco } from 'react-monaco-editor';

const editorOptions = {
  fontSize: 18,
  theme: "vs-dark",
  automaticLayout: true,
  codeLens: false,
  minimap: {
    enabled: false,
  },
  language: "rt",
};

const Editor = () => {

  const onEditorMounted = () => console.log('Editor mounted');
  const onChange = () => console.log('Changed!');
  const showOutput = false;
  const value = 'function snowCactusEscapade()';
  const model = monaco.editor.createModel(value, "javascript", "file:///index.js");

  return (
    <div className="editorWrapper">
      {!showOutput ?
        (<MonacoEditor
          options={{ ...editorOptions, model }}
          editorDidMount={onEditorMounted}
          onChange={onChange} />) : null}

    </div>
  )
}


export { Editor };
