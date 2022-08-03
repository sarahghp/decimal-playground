import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as colorScheme } from "react-syntax-highlighter/dist/esm/styles/prism/index.js";
// "vscDarkPlus" chosen arbitrarily because it somewhat matches the editor
// component's colors; "twilight" is also somewhat of a match
import { EXAMPLES } from "./examples/index.js";

const Examples = ({ orderClass } = {}) => {
  return (
    <section className={`exampleDisplay ${orderClass}`}>
      <h2>Welcome to the Decimal Proposal Playground!</h2>

      <p>Test out your Decimal-using code in the editor at your left.</p>

      <p>
        It will execute, and any console output will appear in the console on
        the right.
      </p>

      <p>To see the transpiled code, click "Toggle Output" above.</p>

      <p>
        You can also manipulate the DOM from this code, and see the results with
        "Toggle DOM".
      </p>

      <p>
        If you just want to see some code that uses Decimals, try any of the
        examples below.
      </p>

      <p>
        We are interested in your feedback! Please{" "}
        <a
          target="blank"
          title="Opens in a new tab"
          href="https://github.com/tc39/proposal-decimal"
        >
          fill out our survey
        </a>{" "}
        or post issues to{" "}
        <a
          target="blank"
          title="Opens in a new tab"
          href="https://github.com/tc39/proposal-decimal"
        >
          the proposal repository
        </a>
        .
      </p>

      {EXAMPLES.map(({ title, description, text }) => (
        <section key={title}>
          <hr />
          <details>
            <summary className="exampleTitle">Example: {title}</summary>
            <p>{description}</p>
            <SyntaxHighlighter language="javascript" style={colorScheme}>
              {text}
            </SyntaxHighlighter>
          </details>
        </section>
      ))}
    </section>
  );
};

export { Examples };
