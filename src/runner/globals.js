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
  ">": "gt",
  ">=": "gte",
  "<": "lt",
  "<=": "lte",
};

const binaryExpressionHandler = (left, right, op) => {
  const isDecInstance = (a) => a instanceof Decimal128 || a instanceof Big;

  const leftIsDecimal = isDecInstance(left);
  const rightIsDecimal = isDecInstance(right);

  if (leftIsDecimal !== rightIsDecimal) {
    const leftValue = leftIsDecimal ? `${left}m` : left;
    const rightValue = rightIsDecimal ? `${right}m` : right;

    throw new TypeError(
      `Mixed numeric types are not allowed. In ${op} called with ${leftValue}, ${rightValue}`
    );
  }

  // Now that we've gotten rid of mixed items, we know that whatever is
  // true of left is also true of right
  if (leftIsDecimal) {
    return left[binaryEvaluators[op]](right);
  }

  return eval(`${left} ${op} ${right}`);
};

const wrappedConstructorIdentifier = (a) => {
  if (a === null || a === undefined) {
    throw new TypeError(`Can't convert null or undefined to Decimal.`);
  }

  if (typeof a === "boolean") {
    return Number(a);
  }

  if (typeof a === "bigint") {
    return String(a);
  }

  return a;
};
