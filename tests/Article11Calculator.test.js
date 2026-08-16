"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Article11Calculator_1 = require("../src/engine/Article11Calculator");
function assertEqual(actual, expected, name) {
    if (actual !== expected) {
        throw new Error("".concat(name, ": expected ").concat(expected, ", received ").concat(actual));
    }
    console.log("PASS: ".concat(name));
}
var case1 = (0, Article11Calculator_1.calculateArticle11)(250000000);
assertEqual(case1.finalFee, 6000000, "250 million");
var case2 = (0, Article11Calculator_1.calculateArticle11)(1000000000);
assertEqual(case2.finalFee, 9375000, "1 billion");
var case3 = (0, Article11Calculator_1.calculateArticle11)(5000000000);
assertEqual(case3.finalFee, 21375000, "5 billion");
console.log("Article 11 calculation tests completed.");
