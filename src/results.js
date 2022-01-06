import React, { useEffect, useState, useRef } from "react";
import MonacoEditor from "react-monaco-editor";
import { EDITOR_OPTIONS } from "./constants.js";

const editorOptions = {
  ...EDITOR_OPTIONS,
  readOnly: true,
};

const methods = ["log", "warn", "error", "info", "debug", "command", "result"];

const Results = ({ content }) => {
  const [logsList, setLogsList] = useState([]);
  const [iframe, updateIframe] = useState();
  const iframeContainerRef = useRef();

  const fakeConsole = methods.reduce((obj, m) => {
    obj[m] = (...args) => {
      setLogsList([...logsList, { level: m, data: args }]);
    };
    return obj;
  }, {});

  const run = () => {
    console.log("run called", content, iframe);
    if (content && !iframe) {
      console.log("🦨🦨🦨🦨🦨🦨");
      let innerFrame;
      innerFrame = document.createElement("iframe");
      innerFrame.src = "./src/runner/index.html";
      innerFrame.onload = () =>
        innerFrame.contentWindow.run(content, fakeConsole);
      iframeContainerRef.current?.appendChild(innerFrame);
      updateIframe(innerFrame);
    } else if (iframe) {
      console.log("🦬🦬🦬🦬🦬🦬🦬🦬🦬🦬🦬🦬🦬");
      iframe.onload = () => iframe.contentWindow.run(content, fakeConsole);
      iframe.contentWindow.location.reload();
    } else {
      return;
    }
  };

  useEffect(run, [content]);

  return (
    <>
      <div className="domPlayground" ref={iframeContainerRef}></div>
    </>
  );
};

export { Results };
