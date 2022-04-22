import {
  earlyReturn,
  handleCallExpression,
  passesGeneralChecks,
  replaceWithDecimal,
  sharedOpts,
} from "./shared.js";

const implementationIdentifier = "Big";

const opToName = sharedOpts;

const replaceWithDecimalExpression = (t, knownDecimalNodes) => (path) => {
  let { left, right, operator } = path.node;

  if (path.get("left").isIdentifier()) {
    left = t.callExpression(t.identifier('wrappedBinaryIdentifier'), [left])
  }

  if (path.get("right").isIdentifier()) {
    right = t.callExpression(t.identifier('wrappedBinaryIdentifier'), [right])
  }

  const argumentIsIdentifier = path.get("left").isIdentifier() || path.get("right").isIdentifier();
  const leftIsDecimal = knownDecimalNodes.has(left) || argumentIsIdentifier;
  const rightIsDecimal = knownDecimalNodes.has(right) || argumentIsIdentifier;

  if (earlyReturn([!leftIsDecimal && !rightIsDecimal])) {
    return;
  }

  passesGeneralChecks(path, knownDecimalNodes, opToName);

  /* Add function(s) for implementation-specific checks here */

  const member = t.memberExpression(left, t.identifier(opToName[operator]));

  const newNode = t.callExpression(member, [right]);

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
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
        exit: replaceWithDecimalExpression(t, knownDecimalNodes),
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
