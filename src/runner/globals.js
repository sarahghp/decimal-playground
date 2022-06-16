/*
  This is a file for things we need to declare in the global scope.
  Use only under the greatest duress.
*/

const Decimal128 = Decimal.clone();

const binaryEvaluators = {
  "+": "add",
  "*": "mul",
  "-": "sub",
  "/": "div",
  "%": "mod",
  ">": "gt",
  ">=": "gte",
  "<": "lt",
  "<=": "lte",
  "==": "eq",
};
const isDecInstance = (a) => a instanceof Decimal128 || a instanceof Big;

const binaryExpressionHandler = (left, right, op, message) => {
  const leftIsDecimal = isDecInstance(left);
  const rightIsDecimal = isDecInstance(right);

  if (leftIsDecimal !== rightIsDecimal) {
    throw new TypeError(message);
  }

  // Now that we've gotten rid of mixed items, we know that whatever is
  // true of left is also true of right
  if (leftIsDecimal) {
    return left[binaryEvaluators[op]](right);
  }

  return eval(`${left} ${op} ${right}`);
};

const wrappedConstructorIdentifier = (a, error) => {
  if (a === null || a === undefined) {
    throw new TypeError(error);
  }

  if (typeof a === "boolean") {
    return Number(a);
  }

  if (typeof a === "bigint") {
    return String(a);
  }

  return a;
};

const unaryEvaluators = {
  "-"(argument) {
    return argument.mul(-1);
  },
};

const wrappedUnaryNegate = (argument, operator, error) => {
  if (!isDecInstance(argument)) {
    return eval(`${operator}${argument}`);
  }

  if (!Reflect.has(unaryEvaluators, operator)) {
    throw new SyntaxError(error);
  }

  return unaryEvaluators[operator](argument);
};
