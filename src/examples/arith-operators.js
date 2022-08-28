import dedent from "dedent";

const title = "Basics: Arithmentic Operators";
const description = "A tour of the arithmentic operators: + - * / %.";

const text = dedent`
// Decimal supports arithmeticical operations: + - * / %

// *, -, and % work as you expect, but will throw
// if called with a Decimal mixed with another value
const multiplied = 11.32m * 44.8m * 7345m;
const subtracted = 11.32m - 44.8m;
const modded = 21.3m % 1.3m;

log("multiplied:", multiplied);
log("subtracted:", subtracted);
log("modded:", modded);

// 11.32m - 44.8; // uncomment to throw
// 11.32m * 44.8; // uncomment to throw
// 21.3m % 1.3;   // uncomment to throw

// + can be used to add or concatenate
const added = 11.32m + 85.8921m + 10.m;
const concatted = 11.32m + " is very cool";

log("added:", added);
log("concatted:", concatted);

// but calling it with any other type will also throw
// 11.32m + 893785.8921;  // uncomment to throw

// Division is a bit more complicated
// The / operator only works in Decimal128 mode
// Uncomment the below and switch between
// Decimal impl. to see what happens

// const divided = 11m/13m;
// log("divided:", divided);

// But don't worry, the Decimal.divide method always works
const dividedAgain = Decimal.divide(11m, 13m);
log("divided method", dividedAgain);
`;

export const ARITH_OPERATORS = {
  title,
  description,
  text,
};
