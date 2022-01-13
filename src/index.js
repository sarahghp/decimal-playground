import "regenerator-runtime/runtime.js";
import React from "react";
import { render } from "react-dom";
import { monaco } from "react-monaco-editor";
import { App } from "./app.js";
import { DEFAULT_TEXT } from "./constants.js";

const hash = window.location.hash;
console.log(`loading from hash ${hash}`);

let content;
let data;

try {
  if (hash) {
    const json = atob(hash.slice(1));
    data = JSON.parse(json);
  }

  content = data?.content || DEFAULT_TEXT;
  console.log(`loading content: ${content}`);
} catch (err) {
  console.error(err);
}

monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  diagnosticCodesToIgnore: [1351, 7027],
});

const editorModel = monaco.editor.createModel(content, "javascript");

render(
  <App editorModel={editorModel} output={content} />,
  document.getElementById("playground")
);
