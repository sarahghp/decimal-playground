import React, { useState } from "react";
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

const panes = [EDITOR, OUTPUT, CONSOLE, DOM_PLAYGROUND];

const Controls = ({
  toggleDecimalImpl,
  toggleView,
  toggleViewType,
  visibleComponents,
}) => {
  const [viewType, updateViewType] = useState(THREE_UP);
  const [decimalType, updateDecimalType] = useState(DECIMAL_128);

  const buttonClass = (item) =>
    visibleComponents.includes(item) ? "on titleItem" : "off titleItem";

  const changeViewType = (event) => {
    const val = event.target.value;
    updateViewType(val);
    toggleViewType(val);
  };

  const changeDecimalType = (event) => {
    const val = event.target.value;
    updateDecimalType(val);
    toggleDecimalImpl(val);
  };

  return (
    <>
      {panes.map((pane) => (
        <button
          className={buttonClass(pane)}
          onClick={toggleView.bind(null, pane)}
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
          value={decimalType}
          onChange={changeDecimalType}
        >
          <option value={BIG_DECIMAL}>{BIG_DECIMAL}</option>
          <option value={DECIMAL_128}>{DECIMAL_128}</option>
        </select>
      </div>
    </>
  );
};

export { Controls };
