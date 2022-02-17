import React, { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { EDITOR_OPTIONS } from "./constants.js";

const Editor = ({ orderClass, model, updateOutput = () => {} } = {}) => {
  const [value, updateValue] = useState(model.getValue());

  const onChange = (newValue) => {
    updateValue(newValue);
    updateOutput(newValue);
  };

  return (
    <div className={`editorWrapper ${orderClass}`}>
      <MonacoEditor
        options={EDITOR_OPTIONS}
        onChange={onChange}
        laguage="javascript"
        value={value}
      />
    </div>
  );
};

export { Editor };
