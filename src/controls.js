import React from "react";
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
import { EXAMPLES } from "./examples.js";

const panes = [EDITOR, OUTPUT, CONSOLE, DOM_PLAYGROUND];

const Controls = ({
  decimalImpl,
  toggleDecimalImpl,
  viewType,
  toggleViewType,
  visibleComponents,
  toggleComponents,
  selectedExample,
  loadExample,
}) => {
  const buttonClass = (item) =>
    visibleComponents.includes(item) ? "on titleItem" : "off titleItem";

  const changeViewType = (event) => {
    const val = event.target.value;
    toggleViewType(val);
  };

  const changeDecimalType = (event) => {
    const val = event.target.value;
    toggleDecimalImpl(val);
  };

  const changeExample = (event) => {
    const exampleKey = event.target.value;
    loadExample(exampleKey);
  };

  return (
    <>
      {panes.map((pane) => (
        <button
          key={pane}
          className={buttonClass(pane)}
          onClick={toggleComponents.bind(null, pane)}
        >
          {`Toggle ${pane}`}
        </button>
      ))}

      <div className="titleItem">
        <p>
          <label htmlFor="select-layout">Layout type</label>
        </p>
        <select id="select-layout" value={viewType} onChange={changeViewType}>
          <option value={THREE_UP}>{THREE_UP}</option>
          <option value={CHECKERBOARD}>{CHECKERBOARD}</option>
        </select>
      </div>

      <div className="titleItem">
        <p>
          <label htmlFor="select-dec-type">Decimal impl.</label>
        </p>
        <select
          id="select-dec-type"
          value={decimalImpl}
          onChange={changeDecimalType}
        >
          <option value={BIG_DECIMAL}>{BIG_DECIMAL}</option>
          <option value={DECIMAL_128}>{DECIMAL_128}</option>
        </select>
      </div>

      <div className="titleItem">
        <p>
          <label htmlFor="select-example">Example</label>
        </p>
        <select
          id="select-example"
          value={selectedExample}
          onChange={changeExample}
        >
          {Object.keys(EXAMPLES).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export { Controls };
