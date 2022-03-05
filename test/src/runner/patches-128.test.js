import { beforeAll, describe, expect, it } from "@jest/globals";
import Big from "big.js";
globalThis.Big = Big;
import Decimal from "decimal.js";
globalThis.Decimal = Decimal;

describe("Runtime tests for Decimal128", function () {
  beforeAll(function () {
    Decimal.set({ precision: 34 });
    return import("../../../src/runner/patches.js");
  });

  describe("Math.abs", function () {
    it("handles decimal", function () {
      expect(Math.abs(Decimal("-1.5"))).toEqual(Decimal("1.5"));
      expect(Math.abs(Decimal("1.5"))).toEqual(Decimal("1.5"));
      expect(Math.abs(Decimal("0"))).toEqual(Decimal("0"));
    });

    it("still handles non-decimal", function () {
      expect(Math.abs(-1.5)).toEqual(1.5);
      expect(Math.abs(1.5)).toEqual(1.5);
      expect(Math.abs(0)).toEqual(0);
    });
  });

  describe("Math.floor", function () {
    it("handles decimal", function () {
      expect(Math.floor(Decimal("-1.5"))).toEqual(Decimal("-2"));
      expect(Math.floor(Decimal("1.5"))).toEqual(Decimal("1"));
    });

    it("still handles non-decimal", function () {
      expect(Math.floor(-1.5)).toEqual(-2);
      expect(Math.floor(1.5)).toEqual(1);
    });
  });

  describe("Math.log10", function () {
    it("handles decimal", function () {
      expect(Math.log10(Decimal("1000"))).toEqual(Decimal("3"));
      expect(Math.log10(Decimal(".001"))).toEqual(Decimal("-3"));
    });

    it("still handles non-decimal", function () {
      expect(Math.log10(1000)).toEqual(3);
      expect(Math.log10(0.001)).toBeCloseTo(-3);
    });
  });

  describe("Math.pow", function () {
    it("handles both arguments decimal", function () {
      expect(Math.pow(Decimal("1.01"), Decimal("12"))).toEqual(
        Decimal("1.126825030131969720661201")
      );
    });

    it("still handles both arguments non-decimal", function () {
      expect(Math.pow(1.01, 12)).toBeCloseTo(
        Number("1.126825030131969720661201")
      );
    });

    it("throws on mixed arguments", function () {
      expect(() => Math.pow(Decimal("1.01"), 12)).toThrow(TypeError);
      expect(() => Math.pow(1.01, Decimal("12"))).toThrow(TypeError);
    });
  });
});
