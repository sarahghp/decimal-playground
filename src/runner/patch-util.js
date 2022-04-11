const decimalOnlyBaseFn = (fnName) => () => {
  throw new TypeError(`${fnName} argument must be a Decimal`);
};

const throwUnimplemented = (what, implName) => {
  throw new Error(
    `${what} is not yet supported for ${implName}. Let us know if you need this! (https://github.com/tc39/proposal-decimal)`
  );
};

export { decimalOnlyBaseFn, throwUnimplemented };
