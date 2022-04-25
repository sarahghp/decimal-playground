/*
  This is a file for things we need to declare in the global scope.
  Use only under the greatest duress.
*/

const Decimal128 = Decimal.clone();

const wrappedBinaryIdentifier = (a) => {
  if (!(a instanceof Decimal128 || a instanceof Big)) {
    throw new SyntaxError("Mixed numeric types are not allowed.")
  }

  return a;
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
}
