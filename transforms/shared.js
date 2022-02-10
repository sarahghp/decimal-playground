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

export const replaceWithDecimal = (t) => (path) => {
  const num = t.stringLiteral(path.node.value);
  const callee = t.identifier("Decimal");

  path.replaceWith(t.callExpression(callee, [num]));
};

export const sharedOpts = {
  "+": "add",
  "*": "mul",
  "-": "sub",
};
