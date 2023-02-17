import numeral from "numeral";

export default function numberFormat(number, justComma = false) {
  let inputString = number >= 10000 && !justComma ? "0,0[.]0a" : "0,0";
  return numeral(number).format(inputString, Math.trunc).toUpperCase();
}
