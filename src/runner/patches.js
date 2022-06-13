/* global Big, Decimal */

import { BIG_DECIMAL, DECIMAL_128 } from "../constants.js";
import {
  invertEquals,
  invertTypeCheckAndCallEq,
  typeCheckAndCallEq,
  typeofCheck,
} from "./patch-library.js";
import {
  checkAndInitMathHandlers,
  initUnsupportedMathHandlers,
} from "./patch-math.js";
import {
  addImpl,
  divideImpl,
  multiplyImpl,
  remainderImpl,
  subtractImpl,
} from "./patch-binary.js";
import { powImpl } from "./patch-pow.js";
import { roundImpl } from "./patch-round.js";
import {
  createUnaryHandler,
  createNaryHandler,
  decimalOnlyBaseFn,
  throwsOnDecimalArg,
  throwUnimplemented,
} from "./patch-util.js";

checkAndInitMathHandlers(createUnaryHandler, createNaryHandler);
initUnsupportedMathHandlers(throwsOnDecimalArg);

Decimal.add = new Proxy(
  decimalOnlyBaseFn("Decimal.add"),
  createUnaryHandler(addImpl)
);

Decimal.divide = new Proxy(
  decimalOnlyBaseFn("Decimal.divide"),
  createUnaryHandler(divideImpl)
);

Decimal.multiply = new Proxy(
  decimalOnlyBaseFn("Decimal.multiply"),
  createUnaryHandler(multiplyImpl)
);

Decimal.pow = new Proxy(
  decimalOnlyBaseFn("Decimal.pow"),
  createUnaryHandler(powImpl)
);

Decimal.remainder = new Proxy(
  decimalOnlyBaseFn("Decimal.remainder"),
  createUnaryHandler(remainderImpl)
);

Decimal.subtract = new Proxy(
  decimalOnlyBaseFn("Decimal.remainder"),
  createUnaryHandler(subtractImpl)
);

Decimal.round = new Proxy(
  decimalOnlyBaseFn("Decimal.round"),
  createUnaryHandler(roundImpl)
);

Decimal.tripleEquals = typeCheckAndCallEq;
Decimal.typeof = typeofCheck;
Decimal.notEquals = invertEquals;
Decimal.notTripleEquals = invertTypeCheckAndCallEq;
