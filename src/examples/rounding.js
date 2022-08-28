import dedent from "dedent";

const title = "Methods: Rounding";
const description = "Getting precise with decimals.";
const text = dedent`
// Decimal includes a number of possible rounding
// modes. They need to be accompanied by a
// maximumFractionDigits argument.

// More about rounding modes: https://unicode-org.github.io/icu/userguide/format_parse/numbers/rounding-modes.html

const d = 6.48904950935m;

// UP
const up = Decimal.round(d, {
    maximumFractionDigits: 6,
    roundingMode: "up"});

log("up:", up);

// DOWN
const down = Decimal.round(d, {
    maximumFractionDigits: 6,
    roundingMode: "down"});

log("down:", down);

// HALF_UP
const halfUp = Decimal.round(6.5m, {
    maximumFractionDigits: 0,
    roundingMode: "half-up"});

log("half-up:", halfUp);

// HALF_DOWN
const halfDown = Decimal.round(6.5m, {
    maximumFractionDigits: 0,
    roundingMode: "half-down"});

log("half-down:", halfDown);
// HALF_EVEN

const halfEven = Decimal.round(d, {
    maximumFractionDigits: 6,
    roundingMode: "half-even"});

log("half-even:", halfEven);

// FLOOR (math override)
const floor = Math.floor(d);
log("floor:", floor);

// CEIL (not implemented)
// Math.ceil(10.m)  // uncomment and it will throw

// Rounding can also be mixed with calculations
// by using methods on the Decimal object

const options = {
    maximumFractionDigits: 6,
    roundingMode: "up"
};

const add = Decimal.add(d, 4.5m, options);
const subtract = Decimal.subtract(d, 4.5m, options);
const multiply = Decimal.multiply(d, 4.5m, options);
const divide = Decimal.divide(d, 4.5m, options);

log("operations:", add, subtract, multiply, divide);
`;

export const ROUNDING = {
  title,
  description,
  text,
};
