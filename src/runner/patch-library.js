/* global Big, Decimal, Decimal128 */

const isAllDecimals = (arr) =>
  arr.every((arg) => arg instanceof Decimal128 || arg instanceof Big);

const containsDecimals = (arr) =>
  arr.some((arg) => arg instanceof Decimal128 || arg instanceof Big);

export const addOrConcat = (left, right, errorMessage) => {
  const someDecimals = containsDecimals([left, right]);

  if (!someDecimals) {
    return left + right;
  }

  const allDecimals = isAllDecimals([left, right]);

  if (allDecimals) {
    return Decimal.add(left, right);
  }

  const containsString = [left, right].some((arg) => typeof arg === "string");

  if (containsString) {
    return [left, right]
      .map((arg) => {
        return typeof arg === "string" ? arg : arg.toString();
      })
      .join("");
  }

  throw new TypeError(`
    Mixed numeric types are not allowed.
    ${errorMessage}
  `);
};

export const typeCheckAndCallEq = (left, right) => {
  const allDecimals = isAllDecimals([left, right]);

  if (!allDecimals) {
    return false;
  }

  return left.eq(right);
};

export const typeofCheck = (arg) => {
  if (arg instanceof Decimal128) {
    return "decimal128";
  }

  if (arg instanceof Big) {
    return "bigdecimal";
  }

  return typeof arg;
};

export const invertEquals = (left, right) => {
  if (left instanceof Decimal128 || right instanceof Decimal128) {
    return !Decimal128(left).eq(right);
  }

  if (left instanceof Big || right instanceof Big) {
    return !Big(left).eq(right);
  }

  return left != right;
};

export const invertTypeCheckAndCallEq = (left, right) =>
  !typeCheckAndCallEq(left, right);
