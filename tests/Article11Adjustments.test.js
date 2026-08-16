"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Article11Adjustments_1 = require("../src/engine/Article11Adjustments");
function assertEqual(actual, expected, name) {
    if (actual !== expected) {
        throw new Error("".concat(name, ": expected ").concat(expected, ", received ").concat(actual));
    }
    console.log("PASS: ".concat(name));
}
var baseFee = 100000000;
// تبصره 3 - کل قرارداد: +100%
var contractFull = (0, Article11Adjustments_1.applyArticle11Adjustments)(baseFee, ["CONTRACT_FULL"]);
assertEqual(contractFull.finalFee, 200000000, "Contract full +100%");
// تبصره 3 - بخشی از قرارداد: +50%
var contractPartial = (0, Article11Adjustments_1.applyArticle11Adjustments)(baseFee, ["CONTRACT_PARTIAL"]);
assertEqual(contractPartial.finalFee, 150000000, "Contract partial +50%");
// تبصره 4 - خسارت: +50%
var damage = (0, Article11Adjustments_1.applyArticle11Adjustments)(baseFee, ["DAMAGE"]);
assertEqual(damage.finalFee, 150000000, "Damage +50%");
// تبصره 6 - چند کارشناس هم‌رشته: -30%
var multiExpert = (0, Article11Adjustments_1.applyArticle11Adjustments)(baseFee, ["MULTI_EXPERT_SAME_FIELD"]);
assertEqual(multiExpert.finalFee, 70000000, "Same-field experts -30%");
// تبصره 7 - دارایی نامشهود: +50%
var intangible = (0, Article11Adjustments_1.applyArticle11Adjustments)(baseFee, ["INTANGIBLE_ASSET"]);
assertEqual(intangible.finalFee, 150000000, "Intangible asset +50%");
console.log("Article 11 adjustment tests completed.");
