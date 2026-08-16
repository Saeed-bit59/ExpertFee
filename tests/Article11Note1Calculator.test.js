"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Article11Note1Calculator_1 = require("../src/engine/Article11Note1Calculator");
function assert(condition, name) {
    if (!condition) {
        throw new Error("FAILED: ".concat(name));
    }
    console.log("PASS: ".concat(name));
}
function near(actual, expected, tolerance, name) {
    assert(Math.abs(actual - expected) <= tolerance, name);
}
/*
 * TEST 1
 * Boundary
 */
assert(!(0, Article11Note1Calculator_1.isArticle11Note1Applicable)(5000000000000), "Exactly 5 HEMMAT is not Note 1 special formula");
assert((0, Article11Note1Calculator_1.isArticle11Note1Applicable)(5000000000001), "Above 5 HEMMAT activates Note 1");
/*
 * TEST 2
 * Excel reference value
 *
 * x =
 * 40,131,293,000,000 Toman
 */
var excelReference = (0, Article11Note1Calculator_1.calculateArticle11Note1)({
    evaluationValueToman: 40131293000000,
    applyFiftyPercentIncrease: false,
    expertCount: 1
});
near(excelReference.feePerExpert, 470453358, 2, "Excel reference calculation");
/*
 * TEST 3
 * 50% option OFF
 */
assert(excelReference
    .fiftyPercentIncreaseAmount === 0, "50 percent OFF");
assert(excelReference.feePerExpert ===
    excelReference
        .feeBeforeFiftyPercent, "Fee unchanged when 50 percent is OFF");
/*
 * TEST 4
 * 50% option ON
 */
var with50 = (0, Article11Note1Calculator_1.calculateArticle11Note1)({
    evaluationValueToman: 40131293000000,
    applyFiftyPercentIncrease: true,
    expertCount: 1
});
near(with50.rawFeeAfterFiftyPercent, 705680037, 2, "50 percent calculation");
near(with50.feePerExpert, 705680037, 2, "Final fee after 50 percent");
/*
 * TEST 5
 * 800 million cap AFTER +50%
 */
var capAfter50 = (0, Article11Note1Calculator_1.calculateArticle11Note1)({
    evaluationValueToman: 100000000000000,
    applyFiftyPercentIncrease: true,
    expertCount: 1
});
assert(capAfter50.feePerExpert ===
    800000000, "800 million cap after 50 percent");
assert(capAfter50.cappedAfterIncrease, "Cap flag after 50 percent");
/*
 * TEST 6
 * Formula itself exceeds cap
 */
var highValue = (0, Article11Note1Calculator_1.calculateArticle11Note1)({
    evaluationValueToman: 243000000000000,
    applyFiftyPercentIncrease: false,
    expertCount: 1
});
assert(highValue.feePerExpert ===
    800000000, "Formula capped at 800 million");
assert(highValue.cappedBeforeIncrease, "Base formula cap detected");
/*
 * TEST 7
 * Three same-field experts
 *
 * NO 30% REDUCTION
 */
var threeExperts = (0, Article11Note1Calculator_1.calculateArticle11Note1)({
    evaluationValueToman: 40131293000000,
    applyFiftyPercentIncrease: false,
    expertCount: 3
});
near(threeExperts.feePerExpert, 470453358, 2, "Full fee for each same-field expert");
near(threeExperts.totalPanelFee, 1411360074, 6, "Three-expert panel total");
assert(threeExperts
    .sameFieldThirtyPercentReductionApplied
    === false, "30 percent panel reduction disabled");
/*
 * TEST 8
 * Three experts + 50%
 */
var threeExpertsWith50 = (0, Article11Note1Calculator_1.calculateArticle11Note1)({
    evaluationValueToman: 40131293000000,
    applyFiftyPercentIncrease: true,
    expertCount: 3
});
near(threeExpertsWith50.feePerExpert, 705680037, 2, "Each expert receives full +50% fee");
near(threeExpertsWith50.totalPanelFee, 2117040111, 10, "Panel total with 50 percent");
/*
 * TEST 9
 * Required UI messages
 */
assert(threeExperts.warning.length > 0, "Note 1 warning available");
assert(threeExperts.calculationLabel ===
    "محاسبه دستمزد براساس تبصره یک ماده ۱۱", "Calculation label available");
console.log("Article 11 Note 1 tests completed.");
