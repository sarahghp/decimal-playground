const DECIMAL_LITERAL = "DecimalLiteral";

const opToName = {
  '+': 'add',
  '*': 'mul',
  '-': 'sub',
  '/': 'div',
};

const includedOps = new Map(Object.entries(opToName));

const replaceWithDecimalExpression = (t, knownDecimalNodes) => (path) => {

  const { left, right, operator } = path.node;

  if (!knownDecimalNodes.has(left) && !knownDecimalNodes.has(right)) {
    return;
  }

  if (knownDecimalNodes.has(left) !== knownDecimalNodes.has(right)) {
    throw path.buildCodeFrameError(new SyntaxError('Mixed numeric types are not allowed.'));
  }

  if (!includedOps.has(operator)) {
    throw path.buildCodeFrameError(new SyntaxError(`${operator} is not currently supported.`));
  }

  const member = t.memberExpression(
    left,
    t.identifier(opToName[operator])
  );

  const newNode = t.callExpression(
    member,
    [right]
  );

  knownDecimalNodes.add(newNode);

  path.replaceWith(newNode);
};

const replaceWithDecimal = (t) => (path) => {

  const num = t.stringLiteral(path.node.value);
  const callee = t.identifier('Decimal');

  const newPath = path.replaceWith(
    t.callExpression(callee, [num])
  );

};

const addToDecimalNodes = (t, knownDecimalNodes) => (path) => {

  if (!knownDecimalNodes.has(path.node) && path.get('callee').isIdentifier({name: 'Decimal'})) {
    knownDecimalNodes.add(path.node);
  }
};

export default function (babel) {
  const { types: t } = babel;
  const knownDecimalNodes = new WeakSet();

  return {
    name: "decimal-transform",
    manipulateOptions(opts, parserOpts) {
     parserOpts.plugins.push("decimal");
    },
    visitor: {
      BinaryExpression: { exit: replaceWithDecimalExpression(t, knownDecimalNodes) },
      CallExpression: addToDecimalNodes(t, knownDecimalNodes),
      DecimalLiteral: replaceWithDecimal(t),
    }
  }
}
