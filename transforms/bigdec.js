import {
  createIdentifierNode,
  createLiteralsNode,
  earlyReturn,
  handleCallExpression,
  handleMixedOps,
  handleSingleTypeOps,
  handleSpecialCaseOps,
  isDefiniedIdentifier,
  replaceWithDecimal,
  sharedMixedOps,
  sharedSingleOps,
  specialCaseOps,
} from "./shared.js";

const implementationIdentifier = "Big";

const opToName = { ...sharedSingleOps, ...sharedMixedOps };

const replaceWithBinaryDecimalExpression = (t, knownDecimalNodes) => (path) => {
  let { left, right, operator } = path.node;

  const includesIdentifierArgument =
    isDefiniedIdentifier(t, left) || isDefiniedIdentifier(t, right);

  const leftIsDecimal = knownDecimalNodes.has(left);
  const rightIsDecimal = knownDecimalNodes.has(right);

  if (
    earlyReturn([
      !leftIsDecimal && !rightIsDecimal && !includesIdentifierArgument,
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

const replaceWithUnaryDecimalExpression = (t, knownDecimalNodes) => (path) => {
  const { argument, operator } = path.node;

  if (!knownDecimalNodes.has(argument)) {
    return;
  }

  if (operator !== "-") {
    throw path.buildCodeFrameError(
      new SyntaxError(`Unary ${operator} is not currently supported.`)
    );
  }

  /* Add function(s) for implementation-specific checks here */

  const member = t.memberExpression(argument, t.identifier("mul"));
  const newNode = t.callExpression(member, [t.numericLiteral(-1)]);

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
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
      UnaryExpression: {
        exit: replaceWithUnaryDecimalExpression(t, knownDecimalNodes),
      },
    },
  };
}
