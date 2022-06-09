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

Decimal.round = new Proxy(
  decimalOnlyBaseFn("Decimal.round"),
  createUnaryHandler(roundImpl)
);

Decimal.tripleEquals = typeCheckAndCallEq;
Decimal.typeof = typeofCheck;
Decimal.notEquals = invertEquals;
Decimal.notTripleEquals = invertTypeCheckAndCallEq;
