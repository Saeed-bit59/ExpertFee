"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Article11Engine_1 = require("../src/engine/Article11Engine");
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
 * مبلغ عادی
 */
var standard = (0, Article11Engine_1.calculateArticle11Engine)({
    evaluationValueToman: 100000000
});
assert(standard.mode === "STANDARD", "Standard mode selected");
/*
 * TEST 2
 * دقیقاً 5 همت
 *
 * نباید وارد فرمول ویژه شود.
 */
var exactlyFive = (0, Article11Engine_1.calculateArticle11Engine)({
    evaluationValueToman: 5000000000000
});
assert(exactlyFive.mode === "STANDARD", "Exactly 5 HEMMAT uses standard mode");
/*
 * TEST 3
 * بالاتر از 5 همت
 */
var aboveFive = (0, Article11Engine_1.calculateArticle11Engine)({
    evaluationValueToman: 5000000000001
});
assert(aboveFive.mode === "NOTE_1", "Above 5 HEMMAT uses Note 1");
/*
 * TEST 4
 * نمونه Excel
 */
var excelReference = (0, Article11Engine_1.calculateArticle11Engine)({
    evaluationValueToman: 40131293000000
});
near(excelReference.feePerExpertToman, 470453358, 2, "Engine matches Excel reference");
/*
 * TEST 5
 * افزایش 50 درصد
 */
var with50 = (0, Article11Engine_1.calculateArticle11Engine)({
    evaluationValueToman: 40131293000000,
    applyFiftyPercentIncrease: true
});
near(with50.feeBeforeAdjustmentToman, 470453358, 2, "Fee before 50 percent");
near(with50.feeAfterAdjustmentToman, 705680037, 2, "Fee after 50 percent");
near(with50.feePerExpertToman, 705680037, 2, "Final fee after 50 percent");
/*
 * TEST 6
 * سقف 800 میلیون
 */
var capped = (0, Article11Engine_1.calculateArticle11Engine)({
    evaluationValueToman: 100000000000000,
    applyFiftyPercentIncrease: true
});
assert(capped.feePerExpertToman ===
    800000000, "Note 1 maximum fee enforced");
/*
 * TEST 7
 * هیأت سه نفره
 */
var panel = (0, Article11Engine_1.calculateArticle11Engine)({
    evaluationValueToman: 40131293000000,
    expertCount: 3
});
near(panel.feePerExpertToman, 470453358, 2, "Full fee per panel expert");
near(panel.totalFeeToman, 1411360074, 6, "Panel total calculated");
/*
 * TEST 8
 * عدم کاهش 30 درصد
 */
assert(panel
    .sameFieldThirtyPercentReductionApplied
    === false, "No 30 percent reduction in Note 1");
/*
 * TEST 9
 * هشدار
 */
assert(panel.warning !== null, "Note 1 warning returned");
/*
 * TEST 10
 * عنوان خروجی
 */
assert(panel.calculationLabel ===
    "محاسبه دستمزد براساس تبصره یک ماده ۱۱", "Note 1 calculation label");
console.log("Article 11 Engine tests completed.");
