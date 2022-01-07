import React, { useState, useEffect } from "react";
import { transformAsync, transformSync } from "@babel/core";
import PresetEnv from "@babel/preset-env";
import PresetReact from "@babel/preset-react";
import Dec128 from "../transforms/dec128.js";
import { Editor } from "./editor.js";
import { Results } from "./results.js";
import { Output } from "./output.js";

const babelOptions = {
  presets: [[PresetEnv, { modules: false }], [PresetReact]],
  plugins: [[Dec128]],
};

const useTransformedOutput = (code) => {
  const [transformed, setTransformed] = useState("");

  useEffect(() => {
    const transformOutput = async () => {
      try {
        const result = await transformAsync(code, babelOptions);
        console.log("✨", result.code);
        setTransformed(result.code);
      } catch (err) {
        console.warn("😭", err.message);
      }
    };

    transformOutput();
  }, [code]);

  return transformed;
};

const App = ({ editorModel, output }) => {
  const [rawState, updateRawState] = useState(output);
  const transformedOutput = useTransformedOutput(rawState);

  const updateOutput = (newValue) => {
    console.log("🌵");
    updateRawState(newValue);
  };

  return (
    <div>
      <div className="titleRow">
        <h1>🌵☃️ DECIMAL PLAYGROUND ☃️🌵</h1>
        <h1>🚧 Under Construction 🚧</h1>
      </div>
      <div className="row">
        <Editor model={editorModel} updateOutput={updateOutput} />
        <Output content={transformedOutput} />
      </div>
      <div className="row">
        <Results content={transformedOutput} />
      </div>
    </div>
  );
};

export { App };
