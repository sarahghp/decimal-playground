export const coerceConstructorArg = (path, t) => {
  const args = path.get("arguments");
  const [first] = args;

  const error = path.buildCodeFrameError(
    new TypeError(`Can't convert null or undefined to Decimal.`)
  );

  if (
    !args.length ||
    first.isNullLiteral() ||
    first.isIdentifier({ name: "undefined" })
  ) {
    throw error;
  }

  if (first.isBooleanLiteral()) {
    return t.NumericLiteral(Number(first.node.value));
  }

  if (first.isBigIntLiteral()) {
    return t.StringLiteral(first.node.value);
  }

  if (first.isIdentifier()) {
    // Put error message here
    return t.callExpression(t.identifier("wrappedConstructorIdentifier"), [
      first.node,
      t.StringLiteral(error.message),
    ]);
  }

  return first.node;
};

export const coerceNonDecimalArg = (t, arg) => {
  if (t.isBigIntLiteral(arg)) {
    return t.StringLiteral(arg.value);
  }

  if (t.isIdentifier(arg, { name: "undefined" }) || t.isNullLiteral(arg)) {
    return t.NumericLiteral(0);
  }

  if (t.isBooleanLiteral(arg)) {
    return t.NumericLiteral(Number(arg.value));
  }

  // All other argument types are coerced by Big/Decimal128 libs
  return arg;
};
