import dedent from "dedent";

const title = "Basics: Comparisons";
const description = "Contrast comparisons: < > <= >=.";
const text = dedent`
// The usual Javascript comparator operators
// < > <= >= work with Decimal values
// Unlike arithmentic operators, these accept
// mixed arguments.

const lt = .33m < .99m;
const ltMixed = .33m < .99;

log("less than:", lt);
log("less than mixed:", ltMixed);

const lte = .33m <= .33m;
const lteMixed = .33m <= .33;

log("less than or equal:", lte);
log("less than or equal mixed:", lteMixed);

const gt = .33m > .99m;
const gtMixed = .33m > .99;

log("greater than:", gt);
log("greater than mixed:", gtMixed);

const gte = .33m >= .33m;
const gteMixed = .33m >= .33;

log("greater than or equal:", gte);
log("greater than or equal mixed:", gteMixed);
`;

export const COMPARISONS = {
  title,
  description,
  text,
};
