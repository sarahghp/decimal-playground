import React, { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import { EDITOR_OPTIONS } from "./constants.js";

const useDebounce = (value, delay) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return currentValue;
};

const Editor = ({ orderClass, val, updateOutput = () => {} } = {}) => {
  const [value, updateValue] = useState(val);
  const debouncedValue = useDebounce(value, 500);

  const onChange = (newValue) => {
    updateValue(newValue);
  };

  useEffect(() => {
    updateValue(val);
  }, [val]);

  useEffect(() => {
    updateOutput(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className={`editorWrapper ${orderClass}`}>
      <MonacoEditor
        options={EDITOR_OPTIONS}
        onChange={onChange}
        language="javascript"
        value={value}
      />
    </div>
  );
};

export { Editor };
