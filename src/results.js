import React, { useEffect, useState, useRef, useReducer } from "react";
import MonacoEditor from "react-monaco-editor";
import { Console } from "./console.js";
import { EDITOR_OPTIONS, CONSOLE, DOM_PLAYGROUND } from "./constants.js";

const editorOptions = {
  ...EDITOR_OPTIONS,
  readOnly: true,
};

const CLEAR = "clear";
const ADD = "add";

const methods = ["log", "warn", "info", "debug", "command", "result"];
const emptyLogsList = [];
const logsReducer = (state, action) => {
  switch (action.type) {
    case CLEAR:
      return [];
    case ADD:
      return [...state, { level: action.level, data: action.data }];
    default:
      return state;
  }
};

const errorsReducer = (state, action) => {
  switch (action.type) {
    case CLEAR:
      return [];
    case ADD:
      return [...state, { level: action.level, data: action.data }];
    default:
      return state;
  }
};

const Results = ({ content, transError, order }) => {
  const [logsList, updateLogs] = useReducer(logsReducer, emptyLogsList);
  const [errsList, updateErrs] = useReducer(errorsReducer, []);
  const [iframe, updateIframe] = useState();
  const iframeContainerRef = useRef();

  const consoleWithError = {
    error(...args) {
      updateErrs({ type: ADD, level: "error", data: args });
    },
  };

  const fakeConsole = methods.reduce((obj, method) => {
    obj[method] = (...args) => {
      updateLogs({ type: ADD, level: method, data: args });
    };
    return obj;
  }, consoleWithError);

  const run = () => {
    if (!iframe) {
      let innerFrame;
      innerFrame = document.createElement("iframe");
      innerFrame.src = "./src/runner/index.html";
      innerFrame.onload = () =>
        innerFrame.contentWindow.run(content, fakeConsole);
      iframeContainerRef.current?.appendChild(innerFrame);
      updateIframe(innerFrame);
    } else {
      // wait for actual frame to run so iframe.contentWindow.run has been assigned
      // (see runner/index.js)
      setTimeout(() => {
        updateLogs({ type: CLEAR });
        updateErrs({ type: CLEAR });
        iframe.onload = () => iframe.contentWindow.run(content, fakeConsole);
        iframe.contentWindow.location.reload();
      });
    }
  };

  useEffect(run, [content]);

  return (
    <>
      <Console
        orderClass={`${order.CONSOLE || ""}`}
        logsList={logsList}
        errorList={[{ data: transError }, ...errsList]}
      />
      <div
        className={`domPlayground ${order.DOM_PLAYGROUND || ""}`}
        ref={iframeContainerRef}
      ></div>
    </>
  );
};

export { Results };
