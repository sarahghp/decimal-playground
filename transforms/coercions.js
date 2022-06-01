export const coerceConstructorArg = (path, t) => {
  const args = path.get("arguments");
  const [first] = args;

  if (
    !args.length ||
    first.isNullLiteral() ||
    first.isIdentifier({ name: "undefined" })
  ) {
    throw path.buildCodeFrameError(
      new TypeError(`Can't convert null or undefined to Decimal.`)
    );
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

  return arg;
};
