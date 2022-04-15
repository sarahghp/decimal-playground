import pluginTester from "babel-plugin-tester";
import pluginBigDec from "../../transforms/bigdec.js";

const libName = "Big";

const basic = {
  "transforms literal": {
    code: "1000.2m",
    output: `${libName}("1000.2");`,
  },
  "transforms literal without point": {
    code: "1000m",
    output: `${libName}("1000");`,
  },
  "transforms literal with point at end": {
    code: "1000.m",
    output: `${libName}("1000.");`,
  },
};

const constructor = {
  "works with plain number": {
    code: "Decimal(1);",
    output: `${libName}(1);`
  },
  "works with string": {
    code: 'Decimal("1");',
    output: `${libName}("1");`
  },
  "passes expression through": {
    code: 'Decimal(1 + 1);',
    output: `${libName}(1 + 1);`
  },
  "throws on null": {
    code: "Decimal(null)",
    error: "TypeError: Can't convert null or undefined to Decimal."
  },
  "throws on explicit undefined": {
    code: "Decimal(undefined)",
    error: "TypeError: Can't convert null or undefined to Decimal."
  },
  "throws on implicit undefined": {
    code: "Decimal()",
    error: "TypeError: Can't convert null or undefined to Decimal."
  },
  "coerces boolean true": {
    code: "Decimal(true);",
    output: `${libName}(1);`
  },
  "coerces boolean false": {
    code: "Decimal(false);",
    output: `${libName}(0);`
  },
  "coerces BigInt": {
    code: "Decimal(1n);",
    output: `${libName}("1");`
  },
  "does not affect Decimal MemberExpressions":{
    code: "Decimal.round(24.5m, { roundingMode: 'half-up', maximumFractionDigits: 0, })",
    output: `
    Decimal.round(${libName}("24.5"), {
      roundingMode: "half-up",
      maximumFractionDigits: 0,
    });`
  }
}

const doesNotChangeNumbers = {
  "does not change Numbers": "111.4 + 12 - 22;",
  "does not change Numbers in nested BinaryExpressions":
    "(1 + (4 - 2)) * (3 + 4);",
};

const operators = {
  "converts + to .add()": {
    code: "10.3m + 12.4m",
    output: `${libName}("10.3").add(${libName}("12.4"));`,
  },
  "converts - to .sub()": {
    code: "10.3m - 12.4m",
    output: `${libName}("10.3").sub(${libName}("12.4"));`,
  },
  "converts * to .mult()": {
    code: "10.3m * 12.4m",
    output: `${libName}("10.3").mul(${libName}("12.4"));`,
  },
  "converts unary - to .neg()": {
    code: "-10.3m + -12.4m",
    output: `${libName}("10.3").neg().add(${libName}("12.4").neg());`,
  },
};

const nestedOutput = `${libName}("0.4").add(${libName}("11.3").sub(${libName}("89").mul(${libName}("10").add(${libName}("33.45")))));`;

const longNestedOutput = `
  ${libName}("21.3")
    .mul(${libName}("0.4").add(${libName}("11.3")))
    .sub(${libName}("10").mul(${libName}("10000.").add(${libName}("90"))))
    .sub(${libName}("80"))
    .add(${libName}("35.67").mul(${libName}("103429.642950")))
    .add(${libName}("21.3").mul(${libName}("0.4").add(${libName}("11.3"))))
    .sub(${libName}("10").mul(${libName}("10000.")))
    .add(${libName}("90"))
    .sub(${libName}("80"))
    .add(${libName}("35.67").mul(${libName}("103429.642950")));
`;

const inBinaryExpressions = {
  "transforms nested BinaryExpressions without parens": {
    code: "0.4m + 11.3m + 89m;",
    output: `${libName}("0.4").add(${libName}("11.3")).add(${libName}("89"));`,
  },
  "transforms nested BinaryExpressions with parens": {
    code: "0.4m + (11.3m - 89m * (10m + 33.45m));",
    output: nestedOutput,
  },
  "transforms long nested BinaryExpressions": {
    code: "21.3m * (0.4m + 11.3m) - (10m * (10000.m + 90m)) - 80m + 35.67m * 103429.642950m + 21.3m * (0.4m + 11.3m) - 10m * 10000.m + 90m - 80m + 35.67m * 103429.642950m ;",
    output: longNestedOutput,
  },
  "transforms negation of expression": {
    code: "-(0.001m + 17.6m)",
    output: `${libName}("0.001").add(${libName}("17.6")).neg();`,
  },
};

const inFunctions = {
  "works with implicit return arrow function": {
    code: "const addToADecimal = (x) => x + 12.6m;",
    output: "const addToADecimal = (x) => x + Decimal(12.6);",
  },
};

const longDecimalRoundOutput = `
  Decimal.round(${libName}("1.5"), {
    roundingMode: "up",
    maximumFractionDigits: 0,
  }).neg();
`;

const withKnownDecimalInputs = {
  "works with Decimal.round": {
    code: '-Decimal.round(1.5m, { roundingMode: "up", maximumFractionDigits: 0 });',
    output: longDecimalRoundOutput,
  },
  "unary Math method with known decimal input is known to be decimal": {
    code: "-Math.abs(-1.5m);",
    output: `Math.abs(${libName}("1.5").neg()).neg();`,
  },
  "unary Math method with known non-decimal input is not transformed": {
    code: "-Math.abs(-1.5);",
    output: "-Math.abs(-1.5);",
  },
  "n-ary Math method with known decimal inputs is known to be decimal": {
    code: "-Math.pow(1.01m, 12m);",
    output: `Math.pow(${libName}("1.01"), ${libName}("12")).neg();`,
  },
  "n-ary Math method with known non-decimal inputs is not transformed": {
    code: "-Math.pow(1.01, 12);",
    output: "-Math.pow(1.01, 12);",
  },
  "n-ary math method with mixed inputs is not transformed": {
    code: "-Math.pow(1.01m, 12);",
    output: `-Math.pow(${libName}("1.01"), 12);`,
  },
};

pluginTester({
  plugin: pluginBigDec,
  pluginName: "plugin-big-decimal",
  tests: {
    ...basic,
    ...constructor,
    ...operators,
    ...inBinaryExpressions,
    ...inFunctions,
    ...doesNotChangeNumbers,
    ...withKnownDecimalInputs,
  },
});
