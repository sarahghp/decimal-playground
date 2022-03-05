import {
  earlyReturn,
  isMathMethod,
  passesGeneralChecks,
  replaceWithDecimal,
  replaceWithUnaryDecimalExpression,
  sharedOpts,
  supportedMathMethods,
} from "./shared.js";

const implementationIdentifier = "Decimal";

const opToName = {
  ...sharedOpts,
  "/": "div",
};

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
  const callee = path.get("callee");
  if (callee.isIdentifier({ name: implementationIdentifier })) {
    knownDecimalNodes.add(path.node);
    return;
  }

  const methodName = isMathMethod(callee);
  if (methodName && supportedMathMethods.includes(methodName)) {
    const args = path.get("arguments");
    if (args.every((arg) => knownDecimalNodes.has(arg.node))) {
      knownDecimalNodes.add(path.node);
    }
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
      CallExpression: {
        exit: addToDecimalNodes(t, knownDecimalNodes),
      },
      DecimalLiteral: replaceWithDecimal(t, implementationIdentifier),
      UnaryExpression: {
        exit: replaceWithUnaryDecimalExpression(t, knownDecimalNodes),
      },
    },
  };
}
