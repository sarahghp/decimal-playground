/* global Big, Decimal */

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
      return substituteFns[DEC_128](...argsList);
    }

    if (argsList[0] instanceof Big) {
      return substituteFns[BIG_DECIMAL](...argsList);
    }
  },
});
