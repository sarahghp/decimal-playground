import {
  earlyReturn,
  passesGeneralChecks,
  replaceWithDecimal,
  replaceWithUnaryDecimalExpression,
  sharedOpts,
} from "./shared.js";

const opToName = sharedOpts;

const replaceWithDecimalExpression = (t, knownDecimalNodes) => (path) => {
  const { left, right, operator } = path.node;

  const leftIsDecimal = knownDecimalNodes.has(left);
  const rightIsDecimal = knownDecimalNodes.has(right);

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

const addToDecimalNodes = (t, knownDecimalNodes) => (path) => {
  if (path.get("callee").isIdentifier({ name: "Decimal" })) {
    knownDecimalNodes.add(path.node);
  }
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
      CallExpression: addToDecimalNodes(t, knownDecimalNodes),
      DecimalLiteral: replaceWithDecimal(t),
      UnaryExpression: {
        exit: replaceWithUnaryDecimalExpression(t, knownDecimalNodes),
      },
    },
  };
}
