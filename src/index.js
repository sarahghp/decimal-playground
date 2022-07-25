import "regenerator-runtime/runtime.js";
import React from "react";
import { render } from "react-dom";
import { monaco } from "react-monaco-editor";
import { App } from "./app.js";
import { ADDING_WITH_LOGGING } from "./examples/index.js"

const hash = window.location.hash;
console.log(`loading from hash ${hash}`);

let data = {};
let code;
let configOpts;

try {
  if (hash) {
    const json = atob(hash.slice(1));
    data = JSON.parse(json);
  }

  const { content, visibleComponents, decimalImpl, viewType } = data;
  code = content || DEFAULT_TEXT;
  configOpts = { visibleComponents, decimalImpl, viewType };
} catch (err) {
  console.error(err);
}

monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  diagnosticCodesToIgnore: [1351, 7027],
});

const editorModel = monaco.editor.createModel(code, "javascript");

render(
  <App editorModel={editorModel} configOpts={configOpts} output={code} />,
  document.getElementById("playground")
);
