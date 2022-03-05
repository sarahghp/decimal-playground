/* global Big */

const _realMathAbs = Math.abs;
Math.abs = function (arg) {
  if (arg instanceof Big) return arg.abs();
  return _realMathAbs(arg);
};

const _realMathFloor = Math.floor;
Math.floor = function (arg) {
  if (arg instanceof Big) {
    const mode = arg.gt(0) ? Big.roundDown : Big.roundUp;
    return arg.round(0, mode);
  }
  return _realMathFloor(arg);
};

const _realMathLog10 = Math.log10;
Math.log10 = function (arg) {
  if (arg instanceof Big)
    throw new Error("Math.log10() not supported for BigDecimal");
  return _realMathLog10(arg);
};

const _realMathPow = Math.pow;
Math.pow = function (...args) {
  let anyDecimals = false;
  let allDecimals = true;
  for (const arg of args) {
    if (arg instanceof Big) anyDecimals = true;
    else allDecimals = false;
  }

  if (allDecimals) return args[0].pow(args[1].toNumber());
  if (anyDecimals) throw new TypeError(`mixed types not supported in Math.pow`);
  return _realMathPow(...args);
};
