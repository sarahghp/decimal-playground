import { beforeAll, describe, expect, it } from "@jest/globals";
import Big from "big.js";
globalThis.Big = Big;
import Decimal from "decimal.js";
globalThis.Decimal = Decimal;

describe("Runtime tests for BigDecimal", function () {
  beforeAll(function () {
    return import("../../../src/runner/patches.js");
  });

  describe("Math.abs", function () {
    it("handles decimal", function () {
      expect(Math.abs(Big("-1.5"))).toEqual(Big("1.5"));
      expect(Math.abs(Big("1.5"))).toEqual(Big("1.5"));
      expect(Math.abs(Big("0"))).toEqual(Big("0"));
    });

    it("still handles non-decimal", function () {
      expect(Math.abs(-1.5)).toEqual(1.5);
      expect(Math.abs(1.5)).toEqual(1.5);
      expect(Math.abs(0)).toEqual(0);
    });
  });

  describe("Math.floor", function () {
    it("handles decimal", function () {
      expect(Math.floor(Big("-1.5"))).toEqual(Big("-2"));
      expect(Math.floor(Big("1.5"))).toEqual(Big("1"));
    });

    it("still handles non-decimal", function () {
      expect(Math.floor(-1.5)).toEqual(-2);
      expect(Math.floor(1.5)).toEqual(1);
    });
  });

  describe("Math.log10", function () {
    it.skip("handles decimal", function () {
      expect(Math.log10(Big("1000"))).toEqual(Big("3"));
      expect(Math.log10(Big(".001"))).toEqual(Big("-3"));
    });

    it("still handles non-decimal", function () {
      expect(Math.log10(1000)).toEqual(3);
      expect(Math.log10(0.001)).toBeCloseTo(-3);
    });
  });

  describe("Math.pow", function () {
    it("handles both arguments decimal", function () {
      expect(Math.pow(Big("1.01"), Big("12"))).toEqual(
        Big("1.126825030131969720661201")
      );
    });

    it("still handles both arguments non-decimal", function () {
      expect(Math.pow(1.01, 12)).toBeCloseTo(
        Number("1.126825030131969720661201")
      );
    });

    it("throws on mixed arguments", function () {
      expect(() => Math.pow(Big("1.01"), 12)).toThrow(TypeError);
      expect(() => Math.pow(1.01, Big("12"))).toThrow(TypeError);
    });
  });
});
