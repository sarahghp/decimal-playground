import dedent from "dedent";

const title = "Basics: Equality";
const description = "Egads, check out equality.";
const text = dedent`
// As one might expect, the == operator
// compares values regardless of type

const sameTypes = 0.2m + 0.1m == 0.3m;
const mixedTypes = 2.m == 2;
const mixedBigInt = 10n == 10m;

log("all equal:", sameTypes, mixedTypes, mixedBigInt);

// But === does not
const sameTypesTriple = 0.2m + 0.1m === 0.3m;
const mixedTypesTriple = 2.m === 2;
const mixedBigIntTriple = 10n === 10m;

log("not all equal:", sameTypesTriple, mixedTypesTriple, mixedBigIntTriple);

`;

export const EQUALITY = {
  title,
  description,
  text,
};
