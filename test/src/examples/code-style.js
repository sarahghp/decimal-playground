import { describe, expect, it } from "@jest/globals";
import { ESLint } from "eslint";
import prettier from "prettier";
import { EXAMPLES } from "../../../src/examples/index.js";

EXAMPLES.forEach(({ title, text }) => {
  describe(`${title} example`, () => {
    const eslint = new ESLint({
      overrideConfig: {
        globals: {
          Decimal: "readonly",
          log: "readonly",
          React: "readonly",
          ReactDOM: "readonly",
        },
        parser: "@babel/eslint-parser",
        parserOptions: {
          babelOptions: {
            plugins: ["@babel/plugin-syntax-decimal"],
          },
        },
      },
    });

    it("has correct code style", () => {
      // dedent() always strips the last newline
      const standaloneText = text + "\n";
      expect(standaloneText).toEqual(
        prettier.format(standaloneText, { parser: "babel" })
      );
    });

    it("has no lint errors", async () => {
      const [result] = await eslint.lintText(text, {
        filePath: `<${title} example>`,
      });
      expect(result.messages).toEqual([]);
      expect(result.errorCount).toEqual(0);
      expect(result.warningCount).toEqual(0);
    });
  });
});
