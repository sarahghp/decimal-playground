import React, { useState, useEffect } from "react";
import { transformAsync } from "@babel/core";
import PresetEnv from "@babel/preset-env";
import PresetReact from "@babel/preset-react";
import Dec128 from "../transforms/dec128.js";
import BigDec from "../transforms/bigdec.js";

import {
  CONSOLE,
  DOM_PLAYGROUND,
  EDITOR,
  EXAMPLES,
  OUTPUT,
  THREE_UP,
  BIG_DECIMAL,
  DECIMAL_128,
  DEC_128_PREFIX,
} from "./constants.js";

import { Controls } from "./controls.js";
import { Editor } from "./editor.js";
import { Results } from "./results.js";
import { Output } from "./output.js";
import { Examples } from "./example-display.js";

const implementations = {
  [BIG_DECIMAL]: BigDec,
  [DECIMAL_128]: Dec128,
};

const prefixes = {
  [BIG_DECIMAL]: "",
  [DECIMAL_128]: DEC_128_PREFIX,
};

const babelOptions = {
  presets: [[PresetEnv, { modules: false }], [PresetReact]],
};

const useTransformedOutput = (code, decimalImpl) => {
  const [transformed, setTransformed] = useState("");
  const [transformationError, setTransformationError] = useState(null);

  const prefixedCode = `
    ${prefixes[decimalImpl]}
    ${code}
  `;

  useEffect(() => {
    const transformOutput = async () => {
      try {
        const result = await transformAsync(prefixedCode, {
          ...babelOptions,
          plugins: [[implementations[decimalImpl]]],
        });
        setTransformed(result.code);
        setTransformationError(null);
      } catch (err) {
        setTransformationError(
          `${err?.message ?? "Error"}\n${err?.stack ?? ""}`
        );
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

const App = ({ output, configOpts }) => {
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
    configOpts.visibleComponents || [EDITOR, EXAMPLES, CONSOLE]
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
          val={rawInput}
          updateOutput={updateOutput}
        />
        <Output
          orderClass={orderClass(OUTPUT)}
          content={transformationError ?? transformedOutput}
        />
        <Results
          order={{
            CONSOLE: orderClass(CONSOLE),
            DOM_PLAYGROUND: orderClass(DOM_PLAYGROUND),
          }}
          content={transformedOutput}
          transError={transformationError}
        />
        <Examples
          orderClass={orderClass(EXAMPLES)}
          updateExampleOutput={updateOutput}
        />
      </div>
    </>
  );
};

export { App };
