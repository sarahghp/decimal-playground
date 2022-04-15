import { PATCHED_MATH_METHODS } from "../src/constants.js";

export const addToDecimalNodes =
  (t, knownDecimalNodes, implementationIdentifier) => (path) => {
    const callee = path.get("callee");
    if (callee.isIdentifier({ name: implementationIdentifier })) {
      knownDecimalNodes.add(path.node);
      return;
    }

    if (callee.isMemberExpression()) {
      const object = callee.get("object");
      const property = callee.get("property");

      if (object.isIdentifier({ name: "Math" }) && property.isIdentifier()) {
        const methodName = property.node.name;

        if (PATCHED_MATH_METHODS.includes(methodName)) {
          const args = path.get("arguments");
          if (args.every((arg) => knownDecimalNodes.has(arg.node))) {
            knownDecimalNodes.add(path.node);
          }
        }
        return;
      }

      if (
        object.isIdentifier({ name: "Decimal" }) &&
        property.isIdentifier({ name: "round" })
      ) {
        knownDecimalNodes.add(path.node);
      }
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
      new SyntaxError("Mixed numeric types are not allowed.")
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
