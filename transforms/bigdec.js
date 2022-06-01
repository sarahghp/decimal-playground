import {
  checkAndThrowForDecimal,
  createIdentifierNode,
  createLiteralsNode,
  earlyReturn,
  handleCallExpression,
  handleLogicalExpression,
  handleMixedOps,
  handleSingleTypeOps,
  handleSpecialCaseOps,
  isDefiniedIdentifier,
  replaceWithDecimal,
  replaceWithUnaryDecimalExpression,
  sharedMixedOps,
  sharedSingleOps,
  specialCaseOps,
} from "./shared.js";

const implementationIdentifier = "Big";

const opToName = { ...sharedSingleOps, ...sharedMixedOps };

const replaceWithBinaryDecimalExpression = (t, knownDecimalNodes) => (path) => {
  let { left, right, operator } = path.node;

  const isIdentifier = (arg) => isDefiniedIdentifier(t, arg);
  const includesIdentifierArgument = [left, right].some(isIdentifier);
  const bothArgumentsAreIdentifiers = [left, right].every(isIdentifier);

  const leftIsDecimal = knownDecimalNodes.has(left);
  const rightIsDecimal = knownDecimalNodes.has(right);

  if (
    earlyReturn([
      !leftIsDecimal && !rightIsDecimal && !bothArgumentsAreIdentifiers,
    ])
  ) {
    return;
  }

  // if is specialCase, call the special case ops
  const isSpecialCaseOp = Reflect.has(specialCaseOps, operator);

  if (isSpecialCaseOp) {
    handleSpecialCaseOps(t, knownDecimalNodes, path, specialCaseOps);
    return;
  }

  const isMixedTypesOp = Reflect.has(sharedMixedOps, operator);

  const transformations = isMixedTypesOp
    ? handleMixedOps(
        t,
        knownDecimalNodes,
        path,
        opToName,
        implementationIdentifier
      )
    : handleSingleTypeOps(t, knownDecimalNodes, path, opToName);

  if (includesIdentifierArgument) {
    createIdentifierNode(t, knownDecimalNodes, path, transformations);
    return;
  }

  createLiteralsNode(t, knownDecimalNodes, path, transformations);
};

export default function (babel) {
  const { types: t } = babel;
  const knownDecimalNodes = new WeakSet();

  return {
    name: "plugin-big-decimal",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("decimal");
    },
    visitor: {
      BinaryExpression: {
        exit: replaceWithBinaryDecimalExpression(t, knownDecimalNodes),
      },
      CallExpression: {
        exit: handleCallExpression(
          t,
          knownDecimalNodes,
          implementationIdentifier
        ),
      },
      DecimalLiteral: replaceWithDecimal(t, implementationIdentifier),
      LogicalExpression: {
        exit: handleLogicalExpression(t, knownDecimalNodes),
      },
      NewExpression: checkAndThrowForDecimal,
      UnaryExpression: {
        exit: replaceWithUnaryDecimalExpression(t, knownDecimalNodes),
      },
    },
  };
}
