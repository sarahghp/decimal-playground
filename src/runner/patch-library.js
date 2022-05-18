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
