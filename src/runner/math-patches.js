const DEC_128 = "decimal128";
const BIG_DECIMAL = "bigdec";

const createUnaryHandler = (substituteFns) => ({
  apply(target, thisArg, argsList) {
    const [arg] = argsList;
    if (arg instanceof Decimal) {
      return substituteFns[DEC_128](arg);
    }

    if (arg instanceof Big) {
      return substituteFns[BIG_DECIMAL](arg);
    }

    return target.apply(thisArg, argsList);
  },
});

const createNaryHandler = (decimalSubstituteFn) => ({
  apply(target, thisArg, argsList) {
    const decimals = argsList.filter((arg) => arg instanceof Decimal);

    if (decimals.length < argsList.length) {
      throw new TypeError(`mixed types not supported in Math.${mathMethod}`);
    }

    if (decimals.length === 0) {
      return target.apply(thisArg, argsList);
    }

    return decimalSubstituteFn(...argsList);
  },
});

// A few functions can take mixed values (max, min, pow)
// The refiner can be used to apply more careful rules about mixing
const createNaryMixedHandler = (substituteFns, refiner = () => true) => ({
  apply(target, thisArg, argsList) {
    const containsDecimals = argsList.some(
      (arg) => arg instanceof Decimal || arg instanceof Big
    );

    if (!containsDecimals) {
      return target.apply(thisArg, argsList);
    }

    if (!refiner(argsList)) {
      throw new TypeError(
        `types mixed in this fashion not supported in Math.${mathMethod}`
      );
    }

    // We assume that the args are not mixed decimal versions
    // because if they are other things have gone very badly
    if (argsList[0] instanceof Decimal) {
      return substituteFns[DEC_128](...argsList);
    }

    if (argsList[0] instanceof Big) {
      return substituteFns[BIG_DECIMAL](...argsList);
    }
  },
});

// We need to bind the Decimal instance because the function is called assuming
// it is in place of `this`
const absProxies = {
  [DEC_128]: Decimal.abs.bind(Decimal),
  [BIG_DECIMAL]: (arg) => arg.abs(),
};

const floorProxies = {
  [DEC_128]: Decimal.floor.bind(Decimal),
  [BIG_DECIMAL](arg) {
    const mode = arg.gt(0) ? Big.roundDown : Big.roundUp;
    return arg.round(0, mode);
  },
};

const log10Proxies = {
  [DEC_128]: Decimal.log10.bind(Decimal),
  [BIG_DECIMAL]() {
    throw new Error("Math.log10() not supported for BigDecimal");
  },
};

const powProxies = {
  [DEC_128]: Decimal.pow.bind(Decimal),
  [BIG_DECIMAL](args) {
    args[0].pow(args[1].toNumber());
  },
};

Math.abs = new Proxy(Math.abs, absProxies);
Math.floor = new Proxy(Math.floor, floorProxies);
Math.log10 = new Proxy(Math.log10, log10Proxies);
Math.pow = new Proxy(Math.pow, powProxies);
