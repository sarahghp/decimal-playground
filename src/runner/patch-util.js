export function throwUnimplemented(what, implName) {
  throw new Error(
    `${what} not yet supported for ${implName}. Let us know if you need this! (https://github.com/tc39/proposal-decimal)`
  );
}
