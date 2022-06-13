import { BIG_DECIMAL, DECIMAL_128, SHARED_SINGLE_OPS } from "../constants.js";
import { round } from "./patch-round.js";

const nameToImpl = {
  [DECIMAL_128]: Decimal128,
  [BIG_DECIMAL]: Big,
};

const ops = {
  ...SHARED_SINGLE_OPS,
  "/": "div",
};

const binaryImplGenerator = (opSymbol) => (name, left, right, options) => {
  const { maximumFractionDigits, roundingMode, errorMessage } = options;

  const impl = nameToImpl[name];

  if (left instanceof impl !== right instanceof impl) {
    throw new TypeError(errorMessage);
  }

  const roundMe = Object.keys(options).length > 1;
  const result = left[ops[opSymbol]](right);

  return roundMe ? round(name, result, options) : result;
};

export const addImpl = {
  [DECIMAL_128](...args) {
    return binaryImplGenerator("+")(DECIMAL_128, ...args);
  },
  [BIG_DECIMAL](...args) {
    return binaryImplGenerator("+")(BIG_DECIMAL, ...args);
  },
};

export const divideImpl = {
  [DECIMAL_128](...args) {
    return binaryImplGenerator("/")(DECIMAL_128, ...args);
  },
  [BIG_DECIMAL](...args) {
    return binaryImplGenerator("/")(BIG_DECIMAL, ...args);
  },
};

export const multiplyImpl = {
  [DECIMAL_128](...args) {
    return binaryImplGenerator("*")(DECIMAL_128, ...args);
  },
  [BIG_DECIMAL](...args) {
    return binaryImplGenerator("*")(BIG_DECIMAL, ...args);
  },
};

export const remainderImpl = {
  [DECIMAL_128](...args) {
    return binaryImplGenerator("%")(DECIMAL_128, ...args);
  },
  [BIG_DECIMAL](...args) {
    return binaryImplGenerator("%")(BIG_DECIMAL, ...args);
  },
};

export const subtractImpl = {
  [DECIMAL_128](...args) {
    return binaryImplGenerator("-")(DECIMAL_128, ...args);
  },
  [BIG_DECIMAL](...args) {
    return binaryImplGenerator("-")(BIG_DECIMAL, ...args);
  },
};
