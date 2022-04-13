/* global Big, Decimal */

import { BIG_DECIMAL, DECIMAL_128 } from "../constants.js";
import { throwUnimplemented } from "./patch-util.js";

const RoundingMode = {
  UP: "up",
  DOWN: "down",
  HALF_UP: "half-up",
  HALF_DOWN: "half-down",
  HALF_EVEN: "half-even",
};

const dec128Modes = new Map([
  [RoundingMode.UP, Decimal.ROUND_UP],
  [RoundingMode.DOWN, Decimal.ROUND_DOWN],
  [RoundingMode.HALF_UP, Decimal.ROUND_HALF_UP],
  [RoundingMode.HALF_DOWN, Decimal.ROUND_HALF_DOWN],
  [RoundingMode.HALF_EVEN, Decimal.ROUND_HALF_EVEN],
]);

const bigDecModes = new Map([
  [RoundingMode.UP, Big.roundUp],
  [RoundingMode.DOWN, Big.roundDown],
  [RoundingMode.HALF_UP, Big.roundHalfUp],
  // half-down not present in big.js
  [RoundingMode.HALF_EVEN, Big.roundHalfEven],
]);

const listFormatter = new Intl.ListFormat("en", { type: "disjunction" });
const quotedModesList = listFormatter.format(
  Object.values(RoundingMode).map((mode) => `"${mode}"`)
);

function throwUnknownRoundingMode(mode) {
  throw new RangeError(
    `"${mode}" isn't a recognized value for roundingMode. You need one of ${quotedModesList}`
  );
}

const roundingModeImpl = {
  [DECIMAL_128](mode) {
    if (!dec128Modes.has(mode)) {
      throwUnknownRoundingMode(mode);
    }
    return dec128Modes.get(mode);
  },
  [BIG_DECIMAL](mode) {
    if (mode === RoundingMode.HALF_DOWN) {
      throwUnimplemented(
        `"${RoundingMode.HALF_DOWN}" rounding mode`,
        "BigDecimal"
      );
    }
    if (!bigDecModes.has(mode)) {
      throwUnknownRoundingMode(mode);
    }
    return bigDecModes.get(mode);
  },
};

const roundFractionImpl = {
  [DECIMAL_128](arg, fractionDigits, mode) {
    return arg.toDecimalPlaces(fractionDigits, mode);
  },
  [BIG_DECIMAL](arg, fractionDigits, mode) {
    return arg.round(fractionDigits, mode);
  },
};

const round = (decimal, options = {}) => {
  // decimal argument is guaranteed to be either a Decimal or Big here
  const implName = decimal instanceof Decimal ? DECIMAL_128 : BIG_DECIMAL;

  if (typeof options !== "object") {
    throw new TypeError("Second argument to Decimal.round() must be an object");
  }

  let { maximumFractionDigits, roundingMode } = options;

  if (!roundingMode) {
    throw new TypeError("RoundingMode option is required for Decimal.round()");
  }

  const coercedFractionDigits = Number(maximumFractionDigits);

  if (!(coercedFractionDigits >= 0)) {
    throw new TypeError(
      "MaximumFractionDigits option is required for Decimal.round()"
    );
  }

  const internalMode = roundingModeImpl[implName](roundingMode);

  return roundFractionImpl[implName](
    decimal,
    coercedFractionDigits,
    internalMode
  );
};

export const roundImpl = {
  [DECIMAL_128](decimal, options) {
    return round(decimal, options);
  },
  [BIG_DECIMAL](decimal, options) {
    return round(decimal, options);
  },
};
