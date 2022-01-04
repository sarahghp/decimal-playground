import React from "react";
import { transform } from "@babel/core";
import PresetEnv from "@babel/preset-env";
import PresetReact from "@babel/preset-react";
import Dec128 from "../transforms/dec128.js";
import { Editor } from "./editor.js";
import { Output } from "./output.js";

const babelOptions = {
  presets: [[PresetEnv, { modules: false }], [PresetReact]],
  plugins: [[Dec128]],
};

const App = ({ editorModel, outputModel }) => {
  const updateOutput = (newValue) => {
    console.log("🌵");
    transform(newValue, babelOptions, function (err, result) {
      if (err) console.warn(err.message);
      if (result) {
        console.log(result.code);
        outputModel.setValue(result.code);
      }
    });
  };

  return (
    <div>
      <h1>🌵☃️🌵☃️🌵☃️🌵☃️🌵☃️🌵☃️🌵☃️🌵☃️🌵</h1>
      <Editor model={editorModel} updateOutput={updateOutput} />
      <Output model={outputModel} />
    </div>
  );
};

export { App };
