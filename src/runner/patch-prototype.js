// add options and error to call
// check for options and then call round on target fn

import { BIG_DECIMAL, DECIMAL_128 } from "../constants.js";
import { dec128Modes, bigDecModes } from "./patch-round.js";

const modes = {
  [DECIMAL_128]: dec128Modes,
  [BIG_DECIMAL]: bigDecModes,
};

export const protoPatch = (name, target, decimal, [val, options = {}]) => {
  console.log("^^^", name, decimal, val, (options = {}));

  const { roundingMode, errorMessage } = options;

  // coerce the argument values to match Number.toFixed semantics
  // 0 works, empty needs to be coerced to 0,
  // need to coerce strings — if it coerces to NaN, the behavior is the same as 0,
  // bigInt throws

  return roundingMode
    ? target.call(decimal, val, modes[name][roundingMode])
    : target.call(decimal, val, modes[name]["half-up"]);
};
