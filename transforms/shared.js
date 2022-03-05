export const earlyReturn = (conditions) => {
  return conditions.every(Boolean);
};

export const isMathMethod = (expr) => {
  if (!expr.isMemberExpression()) return false;

  const object = expr.get("object");
  const property = expr.get("property");
  if (!object.isIdentifier({ name: "Math" }) || !property.isIdentifier())
    return false;

  return property.node.name;
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

export const replaceWithUnaryDecimalExpression =
  (t, knownDecimalNodes) => (path) => {
    const { argument, operator } = path.node;

    if (!knownDecimalNodes.has(argument)) {
      return;
    }

    if (operator !== "-") {
      throw path.buildCodeFrameError(
        new SyntaxError(`${operator} is not currently supported.`)
      );
    }

    const member = t.memberExpression(argument, t.identifier("neg"));
    const newNode = t.callExpression(member, []);

    knownDecimalNodes.add(newNode);

    path.replaceWith(newNode);
    path.skip();
  };

export const sharedOpts = {
  "+": "add",
  "*": "mul",
  "-": "sub",
};
