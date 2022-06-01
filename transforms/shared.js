import {
  PATCHED_MATH_METHODS,
  PATCHED_DECIMAL_METHODS,
} from "../src/constants.js";

import { coerceConstructorArg, coerceNonDecimalArg } from "./coercions.js";

const builtInLibraryName = "Decimal";

const decimalTypeof = (t, knownDecimalNodes, path, argument) => {
  if (!(knownDecimalNodes.has(argument) || t.isIdentifier(argument))) {
    return;
  }

  const member = t.memberExpression(
    t.identifier(builtInLibraryName),
    t.identifier("typeof")
  );

  const newNode = t.callExpression(member, [argument]);

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
};

const handleIdentifierCall = (
  path,
  implementationIdentifier,
  knownDecimalNodes,
  t
) => {
  // This handles the case where uers have @babel/plugin-transform-typeof-symbol enabled
  // which includes everyone using PresetEnv
  if (path.get("callee").isIdentifier({ name: "_typeof" })) {
    decimalTypeof(t, knownDecimalNodes, path, path.node.arguments[0]);
    return;
  }

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

  // should there be an error here if it is not patched & the argument
  // is a Decimal? yes or else pass the error and throw it in the Proxy
  if (
    object.isIdentifier({ name: "Math" }) &&
    PATCHED_MATH_METHODS.includes(methodName)
  ) {
    knownDecimalNodes.add(path.node);
    return;
  }

  // also should pass error frame here or throw
  if (
    object.isIdentifier({ name: builtInLibraryName }) &&
    PATCHED_DECIMAL_METHODS.includes(methodName)
  ) {
    knownDecimalNodes.add(path.node);
  }
};

const handleUnaryExpressionWithIdentifier = (
  t,
  knownDecimalNodes,
  path,
  argument
) => {
  const { operator } = path.node;

  const { message } = path.buildCodeFrameError(
    new SyntaxError(`Unary ${operator} is not currently supported.`)
  );

  const newNode = t.callExpression(t.Identifier("wrappedUnaryNegate"), [
    argument,
    t.StringLiteral(operator),
    t.StringLiteral(message),
  ]);

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
};

const sameTypeCheck = (path, knownDecimalNodes, t) => {
  const { left, right } = path.node;

  const leftIsPossiblyDecimal =
    knownDecimalNodes.has(left) || isDefiniedIdentifier(t, left);
  const rightIsPossiblyDecimal =
    knownDecimalNodes.has(right) || isDefiniedIdentifier(t, right);

  if (leftIsPossiblyDecimal !== rightIsPossiblyDecimal) {
    throw path.buildCodeFrameError(
      new TypeError("Mixed numeric types are not allowed.")
    );
  }
};

const unaryNegate = (t, knownDecimalNodes, path, argument) => {
  const member = t.memberExpression(argument, t.identifier("mul"));
  const newNode = t.callExpression(member, [t.numericLiteral(-1)]);

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
};

export const isDefiniedIdentifier = (t, arg) =>
  t.isIdentifier(arg) && !t.isIdentifier(arg, { name: "undefined" });

export const createIdentifierNode = (
  t,
  knownDecimalNodes,
  path,
  { left, right, operator }
) => {
  const { message } = path.buildCodeFrameError(
    new TypeError("Mixed numeric types are not allowed.")
  );

  const newNode = t.callExpression(t.identifier("binaryExpressionHandler"), [
    left,
    right,
    t.StringLiteral(operator),
    t.StringLiteral(message),
  ]);

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
};

export const checkAndThrowForDecimal = (path) => {
  const callee = path.get("callee");

  if (callee.isIdentifier({ name: builtInLibraryName })) {
    throw path.buildCodeFrameError(
      new TypeError(`Decimal is not a constructor.`)
    );
  }
};

export const createLiteralsNode = (
  t,
  knownDecimalNodes,
  path,
  { left, right, operator, opToName }
) => {
  const member = t.memberExpression(left, t.identifier(opToName[operator]));
  const newNode = t.callExpression(member, [right]);

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
};

export const handleMixedOps = (
  t,
  knownDecimalNodes,
  path,
  opToName,
  implementationIdentifier
) => {
  let { left, right, operator } = path.node;

  includedOpCheck(path, operator, opToName);

  left = knownDecimalNodes.has(left)
    ? left
    : t.callExpression(t.identifier(implementationIdentifier), [
        coerceNonDecimalArg(t, left),
      ]);
  right = knownDecimalNodes.has(right) ? right : coerceNonDecimalArg(t, right);

  return { left, right, operator, opToName };
};

export const handleSingleTypeOps = (t, knownDecimalNodes, path, opToName) => {
  let { left, right, operator } = path.node;

  sameTypeCheck(path, knownDecimalNodes, t);
  includedOpCheck(path, operator, opToName);

  return { left, right, operator, opToName };
};

export const handleSpecialCaseOps = (t, knownDecimalNodes, path, opToName) => {
  // create call to Decimal[opToName[operator]]
  let { left, right, operator } = path.node;

  const member = t.memberExpression(
    t.identifier(builtInLibraryName),
    t.identifier(opToName[operator])
  );
  const newNode = t.callExpression(member, [left, right]);

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
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

export const handleLogicalExpression = (t, knownDecimalNodes) => (path) => {
  let { left, right, operator } = path.node;

  if (!knownDecimalNodes.has(left) && !knownDecimalNodes.has(right)) {
    return;
  }

  const checkAndReplaceZero = (arg) => {
    // We know this is a call expression because the DecimalLiteral is transformed
    // before this is encountered
    const value = arg.arguments[0].value;
    return value === "0" ? t.numericLiteral(0) : arg;
  };

  left = knownDecimalNodes.has(left) ? checkAndReplaceZero(left) : left;
  right = knownDecimalNodes.has(right) ? checkAndReplaceZero(right) : right;

  const newNode = t.logicalExpression(operator, left, right);
  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
};

export const earlyReturn = (conditions) => {
  return conditions.every(Boolean);
};

export const includedOpCheck = (path, operator, includedOps) => {
  if (!Reflect.has(includedOps, operator)) {
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

export const replaceWithUnaryDecimalExpression =
  (t, knownDecimalNodes) => (path) => {
    const { argument, operator } = path.node;
    const isIdentifier = isDefiniedIdentifier(t, argument);

    if (!knownDecimalNodes.has(argument) && !isIdentifier) {
      return;
    }

    if (isIdentifier) {
      handleUnaryExpressionWithIdentifier(t, knownDecimalNodes, path, argument);
      return;
    }

    if (Reflect.has(unaryDecimalFns, operator)) {
      unaryDecimalFns[operator](t, knownDecimalNodes, path, argument);
      return;
    }

    throw path.buildCodeFrameError(
      new SyntaxError(`Unary ${operator} is not currently supported.`)
    );
  };

export const sharedSingleOps = {
  "+": "add",
  "*": "mul",
  "-": "sub",
};

export const sharedMixedOps = {
  ">": "gt",
  ">=": "gte",
  "<": "lt",
  "<=": "lte",
  "==": "eq",
};

export const specialCaseOps = {
  "===": "tripleEquals",
  "!=": "notEquals",
  "!==": "notTripleEquals",
};

export const unaryDecimalFns = {
  typeof: decimalTypeof,
  "-": unaryNegate,
};
