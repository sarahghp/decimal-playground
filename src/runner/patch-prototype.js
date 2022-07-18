/* global Big, Decimal128 */

import { BIG_DECIMAL, DECIMAL_128 } from "../constants.js";
import { dec128Modes, bigDecModes } from "./patch-round.js";

const modes = {
  [DECIMAL_128]: dec128Modes,
  [BIG_DECIMAL]: bigDecModes,
};

const coerceObject = (patchedMethodName, val) => {
  if (patchedMethodName === "toPrecision") {
    throw new RangeError(`
      Value ${val} out of range.
    `);
  }

  return 0;
};

const coerceUndefined = (patchedMethodName, v) => {
  if (patchedMethodName === "toFixed") {
    return 0;
  }

  return v;
};

const coerceString = (patchedMethodName, v) => {
  const n = Number(v);

  if ((isNaN(n) || n === 0) && patchedMethodName === "toPrecision") {
    // throws on toPrecision, is 0 on toFixed & toExponential
    throw new RangeError(`
      Value out of range.
    `);
  }

  if (isNaN(n)) {
    return 0;
  }

  return parseInt(v, 10);
};

const coerceValue = (patchedMethodName, v) => {
  if (!v) {
    return coerceUndefined(patchedMethodName, v);
  }

  if (typeof v === "number") {
    return Math.trunc(v);
  }

  if (typeof v === "string") {
    return coerceString(patchedMethodName, v);
  }

  // this will catch some things like Data and regex and coerce them,
  // which is a bit liberal but I think it's okay for now
  if (typeof v === "object") {
    return coerceObject(patchedMethodName, v);
  }

  // everything else: objects, arrays, BigInts, etc.
  throw new TypeError(`
    ${patchedMethodName} called with unexpected argument: ${typeof v}
  `);
};

export const decProtoPatch =
  (implName, patchedMethodName) =>
  (target, decimal, [val, options = {}]) => {
    const { roundingMode, errorMessage } = options;

    const call = roundingMode
      ? () =>
          target.call(
            decimal,
            coerceValue(patchedMethodName, val, errorMessage),
            modes[implName][roundingMode]
          )
      : () =>
          target.call(
            decimal,
            coerceValue(patchedMethodName, val, errorMessage),
            modes[implName]["half-up"]
          );

    try {
      return call();
    } catch (err) {
      err.message += errorMessage;
      throw new err.constructor(err);
    }
  };

export const decToStringMap = (target, thisArg, [key, val]) => {
  const isDecInstance = (a) => a instanceof Decimal128 || a instanceof Big;

  const convertedKey = isDecInstance(key) ? `${key.toString()}m` : key;
  return target.call(thisArg, convertedKey, val);
};

export const decToStringSet = (target, thisArg, [val]) => {
  const isDecInstance = (a) => a instanceof Decimal128 || a instanceof Big;

  const convertedVal = isDecInstance(val) ? `${val.toString()}m` : val;
  return target.call(thisArg, convertedVal);
};
