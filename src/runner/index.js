/* globals btoa */

globalThis.run = function (source, console) {
  globalThis.console = console;

  const encodedJs = btoa(source);

  const dataUri = "data:text/javascript;base64," + encodedJs;
  return import(/*webpackIgnore: true*/ dataUri).catch((err) => {
    console.error(err.message);
    console.error(err.stack);
  });
};
