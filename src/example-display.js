import React from "react";

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
    </section>
  );
};

export { Examples };
