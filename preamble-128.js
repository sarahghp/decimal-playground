/* global Decimal */

// Decimal128 allows for 34 digits of significand
Decimal.set({ precision: 34 });

const _realMathMethods = {};

// unary Math methods that have a corresponding Decimal static method
["abs", "floor", "log10"].forEach((mathMethod) => {
  _realMathMethods[mathMethod] = Math[mathMethod];
  Math[mathMethod] = function (arg) {
    if (arg instanceof Decimal) return Decimal[mathMethod](arg);
    return _realMathMethods[mathMethod](arg);
  };
});

// Math methods with nargs > 1 that have a corresponding Decimal static method
["pow"].forEach((mathMethod) => {
  _realMathMethods[mathMethod] = Math[mathMethod];
  Math[mathMethod] = function (...args) {
    let anyDecimals = false;
    let allDecimals = true;
    for (const arg of args) {
      if (arg instanceof Decimal) anyDecimals = true;
      else allDecimals = false;
    }

    if (allDecimals) return Decimal[mathMethod](...args);
    if (anyDecimals)
      throw new TypeError(`mixed types not supported in Math.${mathMethod}`);
    return _realMathMethods[mathMethod](...args);
  };
});
