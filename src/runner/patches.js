/* global Big, Decimal */

// Keep in sync with src/constants.js
const BIG_DECIMAL = "big decimal";
const DECIMAL_128 = "decimal 128";

const createUnaryHandler = (substituteFns) => ({
  apply(target, thisArg, argsList) {
    const [arg] = argsList;
    if (arg instanceof Decimal) {
      return substituteFns[DECIMAL_128](arg);
    }

    if (arg instanceof Big) {
      return substituteFns[BIG_DECIMAL](arg);
    }

    return target.apply(thisArg, argsList);
  },
});

// A few functions can take mixed values (max, min, pow)
// The refiner can be used to apply more careful rules about mixing
const createNaryHandler = (substituteFns, refiner = () => true) => ({
  apply(target, thisArg, argsList) {
    const containsDecimals = argsList.some(
      (arg) => arg instanceof Decimal || arg instanceof Big
    );

    if (!containsDecimals) {
      return target.apply(thisArg, argsList);
    }

    if (!refiner(argsList)) {
      throw new TypeError(
        `types mixed in this fashion not supported in Math.${target.name}`
      );
    }

    // We assume that the args are not mixed decimal versions
    // because if they are other things have gone very badly
    if (argsList[0] instanceof Decimal) {
      return substituteFns[DECIMAL_128](...argsList);
    }

    if (argsList[0] instanceof Big) {
      return substituteFns[BIG_DECIMAL](...argsList);
    }
  },
});

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
    throw new Error("Math.log10() not supported for BigDecimal");
  },
};

const powImpl = {
  [DECIMAL_128]: Decimal.pow.bind(Decimal),
  [BIG_DECIMAL](base, exponent) {
    return base.pow(exponent.toNumber());
  },
};

// Keep in sync with supportedMathMethods in transforms/shared.js
Math.abs = new Proxy(Math.abs, createUnaryHandler(absImpl));
Math.floor = new Proxy(Math.floor, createUnaryHandler(floorImpl));
Math.log10 = new Proxy(Math.log10, createUnaryHandler(log10Impl));
Math.pow = new Proxy(
  Math.pow,
  createNaryHandler(powImpl, (args) =>
    args.every((arg) => arg instanceof Decimal || arg instanceof Big)
  )
);
