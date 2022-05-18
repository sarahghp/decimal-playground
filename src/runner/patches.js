/* global Big, Decimal */

import { BIG_DECIMAL, DECIMAL_128 } from "../constants.js";
import { typeCheckAndCallEq, typeofCheck } from "./patch-library.js"
import { checkAndInitMathHandlers } from "./patch-math.js";
import { roundImpl } from "./patch-round.js";
import {
  createUnaryHandler,
  createNaryHandler,
  decimalOnlyBaseFn,
  throwUnimplemented,
} from "./patch-util.js";

checkAndInitMathHandlers(createUnaryHandler, createNaryHandler);

Decimal.round = new Proxy(
  decimalOnlyBaseFn("Decimal.round"),
  createUnaryHandler(roundImpl)
);

Decimal.tripleEquals = typeCheckAndCallEq;
Decimal.typeof = typeofCheck;
