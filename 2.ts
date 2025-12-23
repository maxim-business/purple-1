"use strict";

var makeOrdinal = require("./makeOrdinal");
//isFinite is already declared in lib.es5.d.ts
//var isFinite = require('./isFinite');
var isSafeNumber = require("./isSafeNumber");

enum counts {
  TEN = 10,
  ONE_HUNDRED = 100,
  ONE_THOUSAND = 1000,
  ONE_MILLION = 1000000,
  ONE_BILLION = 1000000000,
  ONE_TRILLION = 1000000000000,
  ONE_QUADRILLION = 1000000000000000,
  MAX = 9007199254740991,
}

var LESS_THAN_TWENTY: string[] = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

var TENTHS_LESS_THAN_HUNDRED: string[] = [
  "zero",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number|string} number
 * @param {boolean} [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
 * @returns {string}
 */
function toWords(number: number | string, asOrdinal?: boolean): string {
  var num = typeof number === "string" ? parseInt(number, 10) : number;

  if (!isFinite(num)) {
    throw new TypeError(
      "Not a finite number: " + number + " (" + typeof number + ")"
    );
  }
  if (!isSafeNumber(num)) {
    throw new RangeError(
      "Input is not a safe number, it’s either too large or too small."
    );
  }
  const words = generateWords({ number: num });
  return asOrdinal ? makeOrdinal(words) : words;
}

type generateWordsParams = {
  number: number;
  word?: string;
  words?: string[];
};

function generateWords(params: generateWordsParams): string {
  let { number, word = "", words = [] } = params;
  let remainder: number = 0;

  // We’re done
  if (number === 0) {
    return !words ? "zero" : words.join(" ").replace(/,$/, "");
  }
  // First run
  if (!words) {
    words = [];
  }
  // If negative, prepend “minus”
  if (number < 0) {
    words.push("minus");
    number = Math.abs(number);
  }

  if (number < 20) {
    remainder = 0;
    word = LESS_THAN_TWENTY[number];
  } else if (number < counts.ONE_HUNDRED) {
    remainder = number % counts.TEN;
    word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / counts.TEN)];
    // In case of remainder, we need to handle it here to be able to add the “-”
    if (remainder) {
      word += "-" + LESS_THAN_TWENTY[remainder];
      remainder = 0;
    }
  } else if (number < counts.ONE_THOUSAND) {
    remainder = number % counts.ONE_HUNDRED;
    word =
      generateWords({ number: Math.floor(number / counts.ONE_HUNDRED) }) +
      " hundred";
  } else if (number < counts.ONE_MILLION) {
    remainder = number % counts.ONE_THOUSAND;
    word =
      generateWords({ number: Math.floor(number / counts.ONE_THOUSAND) }) +
      " thousand,";
  } else if (number < counts.ONE_BILLION) {
    remainder = number % counts.ONE_MILLION;
    word =
      generateWords({ number: Math.floor(number / counts.ONE_MILLION) }) +
      " million,";
  } else if (number < counts.ONE_TRILLION) {
    remainder = number % counts.ONE_BILLION;
    word =
      generateWords({ number: Math.floor(number / counts.ONE_BILLION) }) +
      " billion,";
  } else if (number < counts.ONE_QUADRILLION) {
    remainder = number % counts.ONE_TRILLION;
    word =
      generateWords({ number: Math.floor(number / counts.ONE_TRILLION) }) +
      " trillion,";
  } else if (number <= counts.MAX) {
    remainder = number % counts.ONE_QUADRILLION;
    word =
      generateWords({ number: Math.floor(number / counts.ONE_QUADRILLION) }) +
      " quadrillion,";
  }

  words.push(word);
  return generateWords({ number: remainder, words: words });
}

module.exports = toWords;
