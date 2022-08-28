import dedent from "dedent";

export const ADDING_WITH_LOGGING = {
  title: "Using the Playground: Adding with Logging",
  description: `This is a basic example showing how Decimal literals work, and
  the quirks of logging them in this playground environment.`,
  text: dedent`
  // Decimal literals are formed by adding
  // the letter 'm' to the value:
  const d = 10.4329m + 11.4329m;

  // Use the log function to print
  // Decimals:
  log("a decimal:", d);

  // or toString() instead:
  console.log(d.toString());

  // When logged with normal console.log,
  // the Decimal shows the object
  // underlying the playground
  // implementation. This isn't part of
  // the proposal.
  console.log("internals:", d);
  `,
};
