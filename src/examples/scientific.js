import dedent from "dedent";

export const SCIENTIFIC_NOTATION = {
  title: "In Action: Scientific Notation",
  description: `Format a Decimal using scientific notation. (This example
  currently only works with Decimal128, since Math.log10 for BigDecimal is not
  yet implemented.)`,
  text: dedent`
  // Adapted from https://github.com/swashcap/scino

  function scino(num, maximumFractionDigits) {
    const asDec = Decimal(num);
    const exponent = Math.floor(Math.log10(Math.abs(asDec)));
    const base = Decimal.round(asDec * Math.pow(10m, -1m * exponent), {
      roundingMode: "half-up",
      maximumFractionDigits,
    });
    const exponentDigits = [...exponent.toString()];
    const superscriptExponent = exponentDigits
      .map((ch) => SUPERSCRIPTS[ch])
      .join("");
    return ${"`${base} \\u00d7 10${superscriptExponent}`"};
  }

  const SUPERSCRIPTS = {
    0: "\u2070",
    1: "\u00b9",
    2: "\u00b2",
    3: "\u00b3",
    4: "\u2074",
    5: "\u2075",
    6: "\u2076",
    7: "\u2077",
    8: "\u2078",
    9: "\u2079",
    "-": "\u207b",
  };

  function printScientificConstant(number, title, unit) {
    const fractionDigits = 8;
    log(${"`${title}: ${scino(number, fractionDigits)} ${unit}`"});
  }

  const avogadro = 6.02214076m * 10m ** 23m;
  printScientificConstant(
    avogadro,
    "Avogadro's number",
    ${'`mol${SUPERSCRIPTS["-"]}${SUPERSCRIPTS[1]}`'}
  );
  const unitCharge = 1.602176634m * 10m ** -19m;
  printScientificConstant(unitCharge, "Unit charge", "C");
  `,
};
