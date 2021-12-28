import pluginTester from "babel-plugin-tester";
import pluginDec128 from "../transforms/dec128.js";

pluginTester({
  plugin: pluginDec128,
  pluginName: "plugin-decimal-128",
  tests: {
    "does not change numbers in nested BinaryExpressions": "(1 + 2) * (3 + 4);",
    "transforms nested BinaryExpressions without parens": {
      code: "0.4m + 11.3m + 89m;",
      output: 'Decimal("0.4").add(Decimal("11.3")).add(Decimal("89"));',
    },
  },
});
