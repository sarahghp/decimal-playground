/*
  This is a file for things we need to declare in the global scope.
  Use only under the greatest duress.
*/

const Decimal128 = Decimal.clone();

const SHARED_SINGLE_OPS = {
  "+": "add",
  "*": "mul",
  "-": "sub",
  "/": "div",
  "%": "mod",
};

const SHARED_MIXED_OPS = {
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

  if (Reflect.has(SHARED_MIXED_OPS, op)) {
    return left[SHARED_MIXED_OPS[op]](right);
  }

  if (leftIsDecimal !== rightIsDecimal) {
    throw new TypeError(message);
  }

  // Now that we've gotten rid of mixed items, we know that whatever is
  // true of left is also true of right
  if (leftIsDecimal) {
    return left[SHARED_SINGLE_OPS[op]](right);
  }

  return Function(`return ${left} ${op} ${right}`)();
};

const log = (...args) => {
  const updatedArgs = args.map((el) =>
    isDecInstance(el) ? el.toString() : el
  );
  console.log(updatedArgs);
};

const wrappedConditionalTest = (a) => {
  if (isDecInstance(a)) {
    return Number(a);
  }

  return a;
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

const wrappedUnaryHandler = (argument, operator, error) => {
  // TODO: Figure out why Function(`return ${operator} ${argument}`)() fails with typeof
  if (operator === "typeof") {
    return typeof argument;
  }

  if (!isDecInstance(argument)) {
    return Function(`return ${operator} ${argument}`)();
  }

  if (!Reflect.has(unaryEvaluators, operator)) {
    throw new SyntaxError(error);
  }

  return unaryEvaluators[operator](argument);
};
