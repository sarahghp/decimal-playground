import {
  earlyReturn,
  handleCallExpression,
  passesGeneralChecks,
  replaceWithDecimal,
  sharedOpts,
} from "./shared.js";

const implementationIdentifier = "Decimal128";

const opToName = {
  ...sharedOpts,
  "/": "div",
};
const includedOps = new Map(Object.entries(opToName));

const replaceWithDecimalExpression = (t, knownDecimalNodes) => (path) => {
  let { left, right, operator } = path.node;

  const includesIdentifierArgument =
    path.get("left").isIdentifier() || path.get("right").isIdentifier();

  const leftIsDecimal = knownDecimalNodes.has(left);
  const rightIsDecimal = knownDecimalNodes.has(right);
  const typeChecks = { leftIsDecimal, rightIsDecimal };

  if (
    earlyReturn([
      !leftIsDecimal && !rightIsDecimal && !includesIdentifierArgument,
    ])
  ) {
    return;
  }

  passesGeneralChecks(path, includedOps, typeChecks);

  /* Add function(s) for implementation-specific checks here */

  const member = t.memberExpression(left, t.identifier(opToName[operator]));

  const newNode = includesIdentifierArgument
    ? t.callExpression(t.identifier("binaryExpressionHandler"), [
        left,
        right,
        t.StringLiteral(operator),
      ])
    : t.callExpression(member, [right]);

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

  const member = t.memberExpression(argument, t.identifier("neg"));
  const newNode = t.callExpression(member, []);

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
  path.skip();
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
