import React, { useState, useEffect } from "react";
import { transformAsync, transformSync } from "@babel/core";
import PresetEnv from "@babel/preset-env";
import PresetReact from "@babel/preset-react";
import Dec128 from "../transforms/dec128.js";
import {
  CONSOLE,
  DOM_PLAYGROUND,
  EDITOR,
  OUTPUT,
  THREE_UP,
  CHECKERBOARD,
} from "./constants.js";
import { Controls } from "./controls.js";
import { Editor } from "./editor.js";
import { Results } from "./results.js";
import { Output } from "./output.js";

const babelOptions = {
  presets: [[PresetEnv, { modules: false }], [PresetReact]],
  plugins: [[Dec128]],
};

const useTransformedOutput = (code) => {
  const [transformed, setTransformed] = useState("");
  const [transformationError, setTransformationError] = useState(null);

  useEffect(() => {
    const transformOutput = async () => {
      try {
        const result = await transformAsync(code, babelOptions);
        console.log("✨", result.code);
        setTransformed(result.code);
        setTransformationError(null);
      } catch (err) {
        console.warn("😭", err.message);
        setTransformationError(err);
      }
    };

    transformOutput();
  }, [code]);

  return [transformed, transformationError];
};

const App = ({ editorModel, output }) => {
  /* Code transform state and functions  */
  const [rawInput, updateRawInput] = useState(output);
  const [transformedOutput, transformationError] =
    useTransformedOutput(rawInput);

  const updateOutput = (newValue) => {
    console.log("🌵");
    updateRawInput(newValue);
  };

  /* Component ordering state and functions  */
  const [viewType, updateViewType] = useState(THREE_UP);
  const [visibleComponents, updateVisisbleComponents] = useState([
    EDITOR,
    CONSOLE,
    DOM_PLAYGROUND,
  ]);

  const orderClass = (item) => {
    const n = visibleComponents.findIndex((el) => el === item);

    return n > -1 ? `order-${n} ${layoutClass}` : "collapse";
  };

  const layoutClass =
    viewType === THREE_UP ? "columnsView" : "checkerboardView";

  const toggleView = (item) => {
    const itemPosition = visibleComponents.findIndex((el) => el === item);

    if (itemPosition < 0) {
      updateVisisbleComponents([...visibleComponents, item]);
      return;
    }

    updateVisisbleComponents([
      ...visibleComponents.slice(0, itemPosition),
      ...visibleComponents.slice(itemPosition + 1),
    ]);
  };

  const toggleViewType = (type) => updateViewType(type);

  return (
    <>
      <div className="titleRow">
        <div>
          <h1>Decimal Playground</h1>
          <h2>🚧 Under Construction 🚧</h2>
        </div>

        <Controls
          toggleView={toggleView}
          toggleViewType={toggleViewType}
          visibleComponents={visibleComponents}
        />
      </div>
      <div className="row">
        <Editor
          orderClass={orderClass(EDITOR)}
          model={editorModel}
          updateOutput={updateOutput}
        />
        <Output
          orderClass={orderClass(OUTPUT)}
          content={transformationError?.message || transformedOutput}
        />
        <Results
          order={{
            CONSOLE: orderClass(CONSOLE),
            DOM_PLAYGROUND: orderClass(DOM_PLAYGROUND),
          }}
          content={transformedOutput}
          error={transformationError}
        />
      </div>
    </>
  );
};

export { App };
