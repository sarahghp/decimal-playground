import { BIG_DECIMAL, DECIMAL_128 } from "../constants.js";

const createUnaryHandler = (substituteFns) => ({
  apply(target, thisArg, argsList) {
    const [arg] = argsList;
    if (arg instanceof Decimal128) {
      return substituteFns[DECIMAL_128](...argsList);
    }

    if (arg instanceof Big) {
      return substituteFns[BIG_DECIMAL](...argsList);
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
    if (argsList[0] instanceof Decimal128) {
      return substituteFns[DECIMAL_128](...argsList);
    }

    if (argsList[0] instanceof Big) {
      return substituteFns[BIG_DECIMAL](...argsList);
    }
  },
});

const decimalOnlyBaseFn = (fnName) => () => {
  throw new TypeError(`${fnName} argument must be a Decimal`);
};

const throwUnimplemented = (what, implName) => {
  throw new Error(
    `${what} is not yet supported for ${implName}. Let us know if you need this! (https://github.com/tc39/proposal-decimal)`
  );
};

export {
  createUnaryHandler,
  createNaryHandler,
  decimalOnlyBaseFn,
  throwUnimplemented,
};
