import dedent from "dedent";

const title = "Methods: Formatting";
const description = "Format your decimals.";

const text = dedent`
// Three formatting functions are available
// on the Decimal prototype: toFixed, toExponential,
// and toPrecision

// toFixed sets the number of spaces after
// the Decimal and fills the rest with 0s
const v1 = 100.455m;
log("fixed 1:", v1.toFixed(2));
log("fixed 2:", v1.toFixed(2, { roundingMode: "half-up" }));
log("fixed 3:", v1.toFixed(null));

const v2 = 0m;
log("fixed 4:", v2.toFixed(2));

// toExponential uses exponential notation
const v3 = 1010.345m;

log("exponential 1:", v3.toExponential(2));
log("exponential 2:", v3.toExponential(3, { roundingMode: "half-up" }));

// toPrecision renders a value to the given precision

log("precision 1:", v1.toPrecision(4));
log("precision 2:", v2.toPrecision(4));
log("precision 3:", v1.toPrecision(4, { roundingMode: "down"}));
`;

export const FORMATTING = {
  title,
  description,
  text,
};
