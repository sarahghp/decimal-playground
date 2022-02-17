import React from "react";
import MonacoEditor from "react-monaco-editor";
import { ObjectInspector } from "react-inspector";
import { EDITOR_OPTIONS } from "./constants.js";

const editorOptions = {
  ...EDITOR_OPTIONS,
  readOnly: true,
  lineNumbers: "off",
  wordWrap: "on",
};

const Console = ({ logsList, error, orderClass }) => {
  return error ? (
    <div className={`editorWrapper ${orderClass}`}>
      <MonacoEditor
        options={editorOptions}
        language="javascript"
        value={error.message}
      />
    </div>
  ) : (
    <div className={`console ${orderClass}`}>
      {logsList.map((log, idx) => (
        <ObjectInspector
          key={idx}
          theme="chromeDark"
          data={log.data.length === 1 ? log.data[0] : log.data}
        />
      ))}
    </div>
  );
};

export { Console };
