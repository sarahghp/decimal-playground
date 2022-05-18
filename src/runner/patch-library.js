export const typeCheckAndCallEq = (left, right) => {
  const allDecimals = [left, right].every(
    (arg) => arg instanceof Decimal128 || arg instanceof Big
  );

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
    return Decimal128(left).eq(right);
  }

  if (left instanceof Big || right instanceof Big) {
    return Big(left).eq(right);
  }

  return left != right;
};

export const invertTypeCheckAndCallEq = (left, right) =>
  !typeCheckAndCallEq(left, right);
