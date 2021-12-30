import React from "react";
import { render } from "react-dom";
import { Editor } from "./editor.js";

const App = () => (
  <div>
    <h1>🌵☃️🌵☃️🌵☃️🌵☃️🌵☃️🌵☃️🌵☃️🌵☃️🌵</h1>
    <Editor />
  </div>
);

render(<App />, document.getElementById("playground"));
