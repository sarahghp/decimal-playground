const DEC_128_PREFIX = `
  // Decimal128 allows for 34 digits of significand
  Decimal128.set({precision: 34});
`;

const EDITOR_OPTIONS = {
  fontSize: 18,
  theme: "vs-dark",
  automaticLayout: true,
  codeLens: false,
  minimap: {
    enabled: false,
  },
  wordWrap: true,
};

const CONSOLE = "Console";
const DOM_PLAYGROUND = "DOM";
const EDITOR = "Editor";
const OUTPUT = "Output";
const EXAMPLES = "Examples";
const THREE_UP = "columns";
const CHECKERBOARD = "checkerboard";
const BIG_DECIMAL = "big decimal";
const DECIMAL_128 = "decimal 128";

// Is pow in both lists? It sure is! It's an experiment. Shhhhhh.
const PATCHED_MATH_METHODS = ["abs", "floor", "log10", "pow"];
const PATCHED_DECIMAL_METHODS = [
  "add",
  "divide",
  "multiply",
  "pow",
  "remainder",
  "round",
  "subtract",
];

const PATCHED_PROTOTYPE_METHODS = ["toExponential", "toFixed", "toPrecision"];

const UNPATCHED_MATH_METHODS = Object.getOwnPropertyNames(Math).filter((el) => {
  // first test filters out capitalized constants
  return /([a-z])+/.test(el) && !PATCHED_MATH_METHODS.includes(el);
});

const SHARED_SINGLE_OPS = {
  "*": "mul",
  "-": "sub",
  "%": "mod",
};

const SHARED_MIXED_OPS = {
  ">": "gt",
  ">=": "gte",
  "<": "lt",
  "<=": "lte",
  "==": "eq",
};

const SPECIAL_CASE_OPS = {
  "+": "addOrConcat",
  "===": "tripleEquals",
  "!=": "notEquals",
  "!==": "notTripleEquals",
};

export {
  EDITOR_OPTIONS,
  CONSOLE,
  DOM_PLAYGROUND,
  EDITOR,
  OUTPUT,
  EXAMPLES,
  THREE_UP,
  CHECKERBOARD,
  BIG_DECIMAL,
  DECIMAL_128,
  DEC_128_PREFIX,
  PATCHED_DECIMAL_METHODS,
  PATCHED_MATH_METHODS,
  PATCHED_PROTOTYPE_METHODS,
  SHARED_SINGLE_OPS,
  SHARED_MIXED_OPS,
  SPECIAL_CASE_OPS,
  UNPATCHED_MATH_METHODS,
};
