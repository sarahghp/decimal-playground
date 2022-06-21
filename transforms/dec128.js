import {
  SHARED_SINGLE_OPS,
  SHARED_MIXED_OPS,
  SPECIAL_CASE_OPS,
} from "../src/constants.js";

import {
  checkAndThrowForDecimal,
  createIdentifierNode,
  createLiteralsNode,
  earlyReturn,
  handleCallExpression,
  handleConditional,
  handleLogicalExpression,
  handleMemberExpression,
  handleMixedOps,
  handleSpecialCaseOps,
  handleSingleTypeOps,
  isDefiniedIdentifier,
  replaceWithDecimal,
  replaceWithUnaryDecimalExpression,
} from "./shared.js";

const implementationIdentifier = "Decimal128";

const opToName = {
  ...SHARED_SINGLE_OPS,
  ...SHARED_MIXED_OPS,
  "/": "div",
};

const replaceWithBinaryDecimalExpression = (t, knownDecimalNodes) => (path) => {
  let { left, right, operator } = path.node;

  const isIdentifier = (arg) => isDefiniedIdentifier(t, arg);
  const includesIdentifierArgument = [left, right].some(isIdentifier);

  const leftIsDecimal = knownDecimalNodes.has(left);
  const rightIsDecimal = knownDecimalNodes.has(right);

  if (
    earlyReturn([
      !leftIsDecimal && !rightIsDecimal && !includesIdentifierArgument,
    ])
  ) {
    return;
  }

  const isSpecialCaseOp = Reflect.has(SPECIAL_CASE_OPS, operator);

  if (isSpecialCaseOp) {
    handleSpecialCaseOps(t, knownDecimalNodes, path, SPECIAL_CASE_OPS);
    return;
  }

  const isMixedTypesOp = Reflect.has(SHARED_MIXED_OPS, operator);

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
    name: "plugin-decimal-128",
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
      Conditional: {
        exit: handleConditional(t, knownDecimalNodes),
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
