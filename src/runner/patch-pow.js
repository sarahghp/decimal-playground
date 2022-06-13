import { BIG_DECIMAL, DECIMAL_128 } from "../constants.js";
import { round } from "./patch-round.js";

const pow = (impl, decimal, exponent, options) => {
  const { maximumFractionDigits, roundingMode, errorMessage } = options;

  if (exponent < 0 || !Number.isInteger(exponent)) {
    throw new RangeError(`
      Decimal.pow must be called with a positive integer as the exponent.
      ${errorMessage}
    `);
  }

  const roundMe = Object.keys(options).length > 1;
  const result = decimal.pow(exponent);

  return roundMe ? round(impl, result, options) : result;
};

export const powImpl = {
  [DECIMAL_128](...args) {
    return pow(DECIMAL_128, ...args);
  },
  [BIG_DECIMAL](...args) {
    return pow(BIG_DECIMAL, ...args);
  },
};
