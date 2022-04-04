import { BIG_DECIMAL, DECIMAL_128 } from "../constants.js";

// NOTE: I think we should still stick to the modes named in the
// proposal and these could be cleaned up a little, but this is for
// demonstration for now
const internalModes = [null, "trunc", "ceil", "floor", "halfExpand"];
const listFormatter = new Intl.ListFormat("en", {
  style: "long",
  type: "disjunction",
});
const modesList = listFormatter.format(internalModes.filter(Boolean));

const roundingModeImpl = {
  [DECIMAL_128](mode) {
    const retval = internalModes.indexOf(`${mode}`);
    if (mode === null || retval === -1)
      throw new RangeError(`bad rounding mode "${mode}"`);
    return retval;
  },
  [BIG_DECIMAL](mode, isNegative) {
    switch (mode) {
      case "ceil":
        return isNegative ? Big.roundDown : Big.roundUp;
      case "floor":
        return isNegative ? Big.roundUp : Big.roundDown;
      case "trunc":
        return Big.roundDown;
      case "halfExpand":
        return Big.roundHalfUp;
      default:
        throw new RangeError(
          `"${mode}" is not a recognized rounding mode. Try one of: ${modesList}`
        );
    }
  },
};

const roundFractionImpl = {
  [DECIMAL_128](arg, mode, fractionDigits) {
    return arg.toDecimalPlaces(fractionDigits, mode);
  },
  [BIG_DECIMAL](arg, mode, fractionDigits) {
    return arg.round(fractionDigits, mode);
  },
};

const roundSignificantImpl = {
  [DECIMAL_128](arg, mode, significantDigits) {
    return arg.toSignificantDigits(significantDigits, mode);
  },
  [BIG_DECIMAL](arg, mode, significantDigits) {
    return arg.prec(significantDigits, mode);
  },
};

const round = (implName, decimal, options = {}) => {
  if (!options || typeof options !== "object") {
    throw new TypeError("bad value for Decimal.round options");
  }

  let { maximumFractionDigits, maximumSignificantDigits, roundingMode } =
    options;

  if (roundingMode === undefined) {
    throw new TypeError("roundingMode option is required for Decimal.round");
  }

  const internalMode = roundingModeImpl[implName](roundingMode, decimal.lt(0));

  if (maximumFractionDigits !== undefined) {
    maximumFractionDigits = +maximumFractionDigits;
    return roundFractionImpl[implName](
      decimal,
      internalMode,
      maximumFractionDigits
    );
  }

  if (maximumSignificantDigits !== undefined) {
    maximumSignificantDigits = +maximumSignificantDigits;
    return roundSignificantImpl[implName](
      decimal,
      internalMode,
      maximumSignificantDigits
    );
  }

  throw new TypeError(
    "one of maximumFractionDigits or maximumSignificantDigits options is required for Decimal.round"
  );
};

export const roundRefiner = ([arg]) => {
  if (!(arg instanceof Big || arg instanceof Decimal)) {
    throw new TypeError("Decimal.round argument must be a Decimal");
  }

  return true;
};

// NOTE: We could refactor the above so we don't have to pass
// the implementation here, but for quick POC, I think it's ok
export const roundImpl = {
  [DECIMAL_128](arg, opts) {
    return round([DECIMAL_128], arg, opts);
  },
  [BIG_DECIMAL](arg, opts) {
    return round([BIG_DECIMAL], arg, opts);
  },
};
