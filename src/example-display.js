import React, { useEffect, useState } from "react";
import { EXAMPLES } from './examples/index.js';

const code = `
// Type your Decimal-using code here!
// It will execute, and any console output
// will appear on the right.
// To see the transpiled code, click
// "Toggle Output" above.
// You can also manipulate the DOM from
// this code, and see the results with
// "Toggle DOM".
// If you just want to see some code that
// uses Decimals, try picking one of the
// examples from the dropdown menu at the
// top right.
function snowCactusEscapade(a) {
  return 11.1m + a;
}
`

const Examples = ({ orderClass, model, updateExampleOutput = () => {} } = {}) => {

  return (
    <div className ={`domPlayground ${orderClass}`} style={{whiteSpace: 'pre-wrap', overflow: 'scroll' }}>
      <h4> Welcome to the Decimal Proposal Playground!</h4>

      <p>Test out your Decimal-using code in the editor at your left.</p>

      <p>It will execute, and any console output
      will appear below.</p>

      <p>To see the transpiled code, click
      "Toggle Output" above.</p>

      <p>You can also manipulate the DOM from
      this code, and see the results with
      "Toggle DOM".</p>

      <p>If you just want to see some code that
      uses Decimals, try any of the examples
      below.</p>

      <p>We are interested in your feedback! Please <a href="https://github.com/tc39/proposal-decimal">fill out our survey</a> or post issues to <a href="https://github.com/tc39/proposal-decimal">the proposal repository</a></p>

      {
        EXAMPLES.map(({ title, text }) => (
          <div>
            <hr />
            <details key={title}>
             Some text about the example
              <button style={{display: 'block', height: "2rem", padding: ".2rem"}} onClick={updateExampleOutput.bind(null, text)}>Copy example to editor</button>
              <summary>{title}</summary>
              <div style={{ border: '1px solid gray', fontSize: '12px', padding: '6px', backgroundColor: '#f0f0f0' }}>
                <code>
                  {text}
                </code>
              </div>
            </details>
          </div>
        ))
      }
    </div>
  );
};


export { Examples };
