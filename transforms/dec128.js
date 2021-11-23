const DECIMAL_LITERAL = "DecimalLiteral";

const opToName = {
  '+': 'add',
  '*': 'mul',
  '-': 'sub',
  '/': 'div',
};

const includedOps = Object.keys(opToName);

const isDecimalOrBinaryExpBare = (t) => (node) => {
  return isDecimal(node) || t.isBinaryExpression(node);
};

const areMixedTypesBare = (isDecimalOrBinaryExp) => (a, b) => {

  return (isDecimalOrBinaryExp(a) && !isDecimalOrBinaryExp(b))
    || !(isDecimalOrBinaryExp(a) && isDecimalOrBinaryExp(b))
};

const isDecimal = (node) => {
  return node.get('callee').isIdentifier({name: 'Decimal'}) || node.type === DECIMAL_LITERAL;
};

const replaceWithDecimalExpression = (t) => (path) => {
  const isDecimalOrBinaryExp = isDecimalOrBinaryExpBare(t);
  const areMixedTypes = areMixedTypesBare(isDecimalOrBinaryExp);

  const { left, right, operator } = path.node;

  if (!isDecimalOrBinaryExp(path.get('left')) && !(isDecimalOrBinaryExp(path.get('right')))) {
    return;
  }

  if (areMixedTypes(path.get('left'), path.get('right'))) {
    throw new Error ('Mixed numeric types are not allowed.');
  }

  if (!includedOps.includes(operator)) {
    throw new Error (`${operator} is not currently supported.`);
  }

  const member = t.memberExpression(
    left,
    t.identifier(opToName[operator])
  );

  path.replaceWith(
    t.callExpression(
      member,
      [right]
    )
  );
};

const replaceWithDecimal = (t) => (path) => {
  const num = t.stringLiteral(path.node.value);
  const callee = t.identifier('Decimal');
  path.replaceWith(
    t.callExpression(callee, [num])
  );
};

export default function (babel) {
  const { types: t } = babel;

  return {
    name: "decimal-transform",
    manipulateOptions(opts, parserOpts) {
     parserOpts.plugins.push("decimal");
    },
    visitor: {
      BinaryExpression: replaceWithDecimalExpression(t),
      DecimalLiteral: replaceWithDecimal(t),
    }
  }
}
