import React, { useEffect, useState } from "react";
import {
  CONSOLE,
  DOM_PLAYGROUND,
  EDITOR,
  OUTPUT,
  THREE_UP,
  CHECKERBOARD,
} from "./constants.js";

const Controls = ({ toggleView, toggleViewType, visibleComponents }) => {
  const buttonClass = (item) =>
    visibleComponents.includes(item) ? "on" : "off";

  return (
    <>
      <button
        className={buttonClass(EDITOR)}
        onClick={toggleView.bind(null, EDITOR)}
      >
        Toggle Editor
      </button>
      <button
        className={buttonClass(OUTPUT)}
        onClick={toggleView.bind(null, OUTPUT)}
      >
        Toggle Output
      </button>
      <button
        className={buttonClass(CONSOLE)}
        onClick={toggleView.bind(null, CONSOLE)}
      >
        Toggle Console
      </button>
      <button
        className={buttonClass(DOM_PLAYGROUND)}
        onClick={toggleView.bind(null, DOM_PLAYGROUND)}
      >
        Toggle DOM
      </button>

      <div>
        <span>Layout type</span>
        <hr />
        <div>
          <input
            type="radio"
            id={THREE_UP}
            name="viewType"
            value={THREE_UP}
            onClick={toggleViewType.bind(null, THREE_UP)}
            defaultChecked
          />
          <label htmlFor={THREE_UP}>{THREE_UP}</label>
        </div>

        <div>
          <input
            type="radio"
            id={CHECKERBOARD}
            name="viewType"
            value={CHECKERBOARD}
            onClick={toggleViewType.bind(null, CHECKERBOARD)}
          />
          <label htmlFor={CHECKERBOARD}>{CHECKERBOARD}</label>
        </div>
      </div>
    </>
  );
};

export { Controls };
