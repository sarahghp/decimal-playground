const opToName = {
  '+': 'add',
  '*': 'mul',
  '-': 'sub',
  '/': 'div',
};

const includedOps = new Map(Object.entries(opToName));

const replaceWithDecimalExpression = (t, knownDecimalNodes) => (path) => {

  const { left, right, operator } = path.node;

  const leftIsDecimal = knownDecimalNodes.has(left);
  const rightIsDecimal = knownDecimalNodes.has(right);

  if (!leftIsDecimal && !rightIsDecimal) {
    return;
  }

  if (leftIsDecimal !== rightIsDecimal) {
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
  path.skip();
};

const replaceWithDecimal = (t) => (path) => {

  const num = t.stringLiteral(path.node.value);
  const callee = t.identifier('Decimal');

  path.replaceWith(
    t.callExpression(callee, [num])
  );
};

const addToDecimalNodes = (t, knownDecimalNodes) => (path) => {
  if (path.get('callee').isIdentifier({name: 'Decimal'})) {
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
      BinaryExpression: { exit: replaceWithDecimalExpression(t, knownDecimalNodes) },
      CallExpression: addToDecimalNodes(t, knownDecimalNodes),
      DecimalLiteral: replaceWithDecimal(t),
    }
  }
}
