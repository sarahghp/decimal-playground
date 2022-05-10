import {
  PATCHED_MATH_METHODS,
  PATCHED_DECIMAL_METHODS,
} from "../src/constants.js";

const builtInLibraryName = "Decimal";

const coerceConstructorArg = (path, t) => {
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

  return first.node;
};

const handleIdentifierCall = (
  path,
  implementationIdentifier,
  knownDecimalNodes,
  t
) => {
  if (path.get("callee").isIdentifier({ name: implementationIdentifier })) {
    knownDecimalNodes.add(path.node);
    return;
  }

  if (path.get("callee").isIdentifier({ name: builtInLibraryName })) {
    const val = coerceConstructorArg(path, t);
    const newNode = t.callExpression(t.Identifier(implementationIdentifier), [
      val,
    ]);

    knownDecimalNodes.add(newNode);
    path.replaceWith(newNode);
    path.skip();
    return;
  }
};

const handleMemberCall = (path, knownDecimalNodes) => {
  const callee = path.get("callee");
  const object = callee.get("object");
  const property = callee.get("property");
  const methodName = property.isIdentifier()
    ? property.node.name
    : property.node.value;

  if (
    object.isIdentifier({ name: "Math" }) &&
    PATCHED_MATH_METHODS.includes(methodName)
  ) {
    knownDecimalNodes.add(path.node);
    return;
  }

  if (
    object.isIdentifier({ name: builtInLibraryName }) &&
    PATCHED_DECIMAL_METHODS.includes(methodName)
  ) {
    knownDecimalNodes.add(path.node);
  }
};

export const handleCallExpression =
  (t, knownDecimalNodes, implementationIdentifier) => (path) => {
    const callee = path.get("callee");

    if (callee.isIdentifier()) {
      handleIdentifierCall(
        path,
        implementationIdentifier,
        knownDecimalNodes,
        t
      );
      return;
    }

    if (callee.isMemberExpression()) {
      handleMemberCall(path, knownDecimalNodes);
      return;
    }
  };

export const earlyReturn = (conditions) => {
  return conditions.every(Boolean);
};

export const passesGeneralChecks = (path, knownDecimalNodes, opToName) => {
  const includedOps = new Map(Object.entries(opToName));

  const { left, right, operator } = path.node;

  const leftIsDecimal = knownDecimalNodes.has(left);
  const rightIsDecimal = knownDecimalNodes.has(right);

  if (leftIsDecimal !== rightIsDecimal) {
    throw path.buildCodeFrameError(
      new TypeError("Mixed numeric types are not allowed.")
    );
  }

  if (!includedOps.has(operator)) {
    throw path.buildCodeFrameError(
      new SyntaxError(`${operator} is not currently supported.`)
    );
  }
};

export const replaceWithDecimal = (t, implementationIdentifier) => (path) => {
  const num = t.stringLiteral(path.node.value);
  const callee = t.identifier(implementationIdentifier);

  path.replaceWith(t.callExpression(callee, [num]));
};

export const sharedOpts = {
  "+": "add",
  "*": "mul",
  "-": "sub",
};
