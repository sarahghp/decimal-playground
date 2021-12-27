const DECIMAL_LITERAL = "DecimalLiteral";

const opToName = {
  '+': 'add',
  '*': 'mul',
  '-': 'sub',
  '/': 'div',
};

const includedOps = new Map(Object.entries(opToName));

const isDecimalOrBinaryExpBare = (t) => (path) => {
  return isDecimal(path) || t.isBinaryExpression(path);
};

const areMixedTypesBare = (isDecimalOrBinaryExp) => (a, b) => {

  return (isDecimalOrBinaryExp(a) && !isDecimalOrBinaryExp(b))
    || !(isDecimalOrBinaryExp(a) && isDecimalOrBinaryExp(b))
};

const isDecimal = (path) => {

  /* There is a better way to do this, but optional chaining is not working with ASTExplorer just now. */

  if (!path.isCallExpression() && !path.type === DECIMAL_LITERAL) {
    return false;
  }

  return path.type === DECIMAL_LITERAL || path.get('callee').isIdentifier({name: 'Decimal'});
};

const replaceWithDecimalExpression = (t) => (path) => {
  const isDecimalOrBinaryExp = isDecimalOrBinaryExpBare(t);
  const areMixedTypes = areMixedTypesBare(isDecimalOrBinaryExp);

  const { left, right, operator } = path.node;

  if (!isDecimalOrBinaryExp(path.get('left')) && !(isDecimalOrBinaryExp(path.get('right')))) {
    return;
  }

  if (areMixedTypes(path.get('left'), path.get('right'))) {
    throw path.buildCodeFrameError(new SyntaxError('Mixed numeric types are not allowed.'));
  }

  if (!includedOps.has(operator)) {
    throw path.buildCodeFrameError(new SyntaxError(`${operator} is not currently supported.`));
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
