import {
  BIG_DECIMAL,
  DECIMAL_128,
  PATCHED_MATH_METHODS,
} from "../constants.js";

const absImpl = {
  [DECIMAL_128]: Decimal.abs.bind(Decimal),
  [BIG_DECIMAL]: (arg) => arg.abs(),
};

const floorImpl = {
  [DECIMAL_128]: Decimal.floor.bind(Decimal),
  [BIG_DECIMAL](arg) {
    const mode = arg.gt(0) ? Big.roundDown : Big.roundUp;
    return arg.round(0, mode);
  },
};

const log10Impl = {
  [DECIMAL_128]: Decimal.log10.bind(Decimal),
  [BIG_DECIMAL]() {
    throwUnimplemented("Math.log10()", "BigDecimal");
  },
};

const powImpl = {
  [DECIMAL_128]: Decimal.pow.bind(Decimal),
  [BIG_DECIMAL](base, exponent) {
    return base.pow(exponent.toNumber());
  },
};

const checkAndInitMathHandlers = (createUnaryHandler, createNaryHandler) => {
  const handlers = {
    abs: createUnaryHandler(absImpl),
    floor: createUnaryHandler(floorImpl),
    log10: createUnaryHandler(log10Impl),
    pow: createNaryHandler(powImpl, (args) =>
      args.every((arg) => arg instanceof Decimal || arg instanceof Big)
    ),
  };

  // consistency check; if the sets are different, `new Proxy()` will throw below
  if (PATCHED_MATH_METHODS.length !== Object.keys(handlers).length) {
    throw new Error(`Programmer error: patched Math method missing`);
  }

  PATCHED_MATH_METHODS.forEach((method) => {
    Math[method] = new Proxy(Math[method], handlers[method]);
  });
};

export {
  checkAndInitMathHandlers
}
