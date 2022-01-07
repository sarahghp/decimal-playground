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

const Console = ({ logsList, error }) => {
  return error ? (
    <div className="editorWrapper">
      <MonacoEditor
        options={editorOptions}
        language="javascript"
        value={error.message}
      />
    </div>
  ) : (
    <div className="console">
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
