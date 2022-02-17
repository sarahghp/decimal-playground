import React, { useState, useEffect } from "react";
import { transformAsync, transformSync } from "@babel/core";
import PresetEnv from "@babel/preset-env";
import PresetReact from "@babel/preset-react";
import Dec128 from "../transforms/dec128.js";
import BigDec from "../transforms/bigdec.js";

import {
  CONSOLE,
  DOM_PLAYGROUND,
  EDITOR,
  OUTPUT,
  THREE_UP,
  CHECKERBOARD,
  BIG_DECIMAL,
  DECIMAL_128,
} from "./constants.js";

import { Controls } from "./controls.js";
import { Editor } from "./editor.js";
import { Results } from "./results.js";
import { Output } from "./output.js";

const implementations = {
  [BIG_DECIMAL]: BigDec,
  [DECIMAL_128]: Dec128,
};

const babelOptions = {
  presets: [[PresetEnv, { modules: false }], [PresetReact]],
};

const useTransformedOutput = (code, decimalImpl) => {
  const [transformed, setTransformed] = useState("");
  const [transformationError, setTransformationError] = useState(null);

  useEffect(() => {
    const transformOutput = async () => {
      try {
        const result = await transformAsync(code, {
          ...babelOptions,
          plugins: [[implementations[decimalImpl]]],
        });
        setTransformed(result.code);
        setTransformationError(null);
      } catch (err) {
        setTransformationError(err);
      }
    };

    transformOutput();
  }, [code, decimalImpl]);

  return [transformed, transformationError];
};

const updateHash = (rawInput, visibleComponents, decimalImpl, viewType) => {
  const data = {
    content: rawInput,
    visibleComponents,
    decimalImpl,
    viewType,
  };

  const json = JSON.stringify(data);
  const hash = btoa(json);

  window.location.hash = hash;
};

const App = ({ editorModel, output, configOpts }) => {
  /* Code transform state and functions  */
  const [rawInput, updateRawInput] = useState(output);
  const [decimalImpl, updateDecimalImpl] = useState(
    configOpts.decimalImpl || DECIMAL_128
  );
  const [transformedOutput, transformationError] = useTransformedOutput(
    rawInput,
    decimalImpl
  );

  const updateOutput = (newValue) => {
    updateRawInput(newValue);
  };

  /* Component ordering state and functions  */
  const [viewType, updateViewType] = useState(configOpts.viewType || THREE_UP);
  const [visibleComponents, updateVisisbleComponents] = useState(
    configOpts.visibleComponents || [EDITOR, CONSOLE, DOM_PLAYGROUND]
  );

  const orderClass = (item) => {
    const n = visibleComponents.findIndex((el) => el === item);

    return n > -1 ? `order-${n} ${layoutClass}` : "collapse";
  };

  const layoutClass =
    viewType === THREE_UP ? "columnsView" : "checkerboardView";

  const toggleComponents = (item) => {
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
  const toggleDecimalImpl = (type) => updateDecimalImpl(type);

  useEffect(
    () => updateHash(rawInput, visibleComponents, decimalImpl, viewType),
    [rawInput, visibleComponents, decimalImpl, viewType]
  );

  return (
    <>
      <div className="titleRow">
        <div>
          <h1>Decimal Playground</h1>
        </div>

        <Controls
          decimalImpl={decimalImpl}
          toggleDecimalImpl={toggleDecimalImpl}
          viewType={viewType}
          toggleViewType={toggleViewType}
          visibleComponents={visibleComponents}
          toggleComponents={toggleComponents}
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
