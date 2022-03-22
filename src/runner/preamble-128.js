// Decimal128 allows for 34 digits of significand
// TODO: This actually does need to be set as a prefix
Decimal.set({ precision: 34 });

const createUnaryHandler = (decimalSubstituteFn) => ({
  apply(target, thisArg, argsList) {
    const [arg] = argsList;
    if (arg instanceof Decimal) {
      return decimalSubstituteFn(arg);
    }

    return target.apply(thisArg, argsList);
  },
});

// A few functions can take mixed values (max, min, pow)
const createNaryMixedHandler = (decimalSubstituteFn, refiner = () => true) => ({
  apply(target, thisArg, argsList) {
    const containsDecimals = argsList.some((arg) => arg instanceof Decimal);

    if (!containsDecimals) {
      return target.apply(thisArg, argsList);
    }

    if (!refiner(argsList)) {
      throw new TypeError(
        `types mixed in this fashion not supported in Math.${mathMethod}`
      );
    }

    return decimalSubstituteFn(...argsList);
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

// We need to bind the Decimal instance because the function is called assuming
// it is in place of `this`
const absProxy = createUnaryHandler(Decimal.abs.bind(Decimal));
const floorProxy = createUnaryHandler(Decimal.floor.bind(Decimal));
const log10Proxy = createUnaryHandler(Decimal.log10.bind(Decimal));

const powProxy = createNaryMixedHandler(Decimal.pow.bind(Decimal));

Math.abs = new Proxy(Math.abs, absProxy);
Math.floor = new Proxy(Math.floor, floorProxy);
Math.log10 = new Proxy(Math.log10, log10Proxy);
Math.pow = new Proxy(Math.pow, powProxy);
