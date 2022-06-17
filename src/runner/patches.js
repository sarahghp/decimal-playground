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
import {
  decProtoPatch,
  decToStringMap,
  decToStringSet,
} from "./patch-prototype.js";
import { roundImpl } from "./patch-round.js";
import {
  createUnaryHandler,
  createNaryHandler,
  createPrototypeHandler,
  decimalOnlyBaseFn,
  throwsOnDecimalArg,
  throwUnimplemented,
  unimplementedButIntended,
} from "./patch-util.js";

checkAndInitMathHandlers(createUnaryHandler, createNaryHandler);
initUnsupportedMathHandlers(throwsOnDecimalArg);

Map.prototype.set = new Proxy(
  Map.prototype.set,
  createPrototypeHandler(decToStringMap)
);

Map.prototype.get = new Proxy(
  Map.prototype.get,
  createPrototypeHandler(decToStringMap)
);

Set.prototype.add = new Proxy(
  Set.prototype.add,
  createPrototypeHandler(decToStringSet)
);

Set.prototype.has = new Proxy(
  Set.prototype.has,
  createPrototypeHandler(decToStringSet)
);

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

Big.prototype.toLocaleString = unimplementedButIntended;
Decimal128.prototype.toLocaleString = unimplementedButIntended;

Decimal128.prototype.toFixed = new Proxy(
  Decimal128.prototype.toFixed,
  createPrototypeHandler(decProtoPatch(DECIMAL_128, "toFixed"))
);

Big.prototype.toFixed = new Proxy(
  Big.prototype.toFixed,
  createPrototypeHandler(decProtoPatch(BIG_DECIMAL, "toFixed"))
);

Decimal128.prototype.toExponential = new Proxy(
  Decimal128.prototype.toExponential,
  createPrototypeHandler(decProtoPatch(DECIMAL_128, "toExponential"))
);

Big.prototype.toExponential = new Proxy(
  Big.prototype.toExponential,
  createPrototypeHandler(decProtoPatch(BIG_DECIMAL, "toExponential"))
);

Decimal128.prototype.toPrecision = new Proxy(
  Decimal128.prototype.toPrecision,
  createPrototypeHandler(decProtoPatch(DECIMAL_128, "toPrecision"))
);

Big.prototype.toPrecision = new Proxy(
  Big.prototype.toPrecision,
  createPrototypeHandler(decProtoPatch(BIG_DECIMAL, "toPrecision"))
);
