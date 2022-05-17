/* global Big, Decimal */

import { BIG_DECIMAL, DECIMAL_128 } from "../constants.js";
import { checkAndInitMathHandlers } from "./patch-math.js";
import { roundImpl } from "./patch-round.js";
import {
  createUnaryHandler,
  createNaryHandler,
  decimalOnlyBaseFn,
  throwUnimplemented,
} from "./patch-util.js";

const typeCheckAndCallEq = (left, right) => {
  const allDecimals = [left, right].every(
    (arg) => arg instanceof Decimal128 || arg instanceof Big
  );

  if (!allDecimals) {
    return false;
  }

  return left.eq(right);
};

const tripleEqualsImpl = {
  [BIG_DECIMAL]: typeCheckAndCallEq,
  [DECIMAL_128]: typeCheckAndCallEq,
};

checkAndInitMathHandlers(createUnaryHandler, createNaryHandler);

Decimal.round = new Proxy(
  decimalOnlyBaseFn("Decimal.round"),
  createUnaryHandler(roundImpl)
);

Decimal.tripleEquals = new Proxy(() => {}, createNaryHandler(tripleEqualsImpl));
