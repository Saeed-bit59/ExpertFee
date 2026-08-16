"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationEngine = void 0;
var DecisionEngine_1 = require("./DecisionEngine");
var CalculationEngine = /** @class */ (function () {
    function CalculationEngine() {
        this.decision = new DecisionEngine_1.DecisionEngine();
    }
    CalculationEngine.prototype.calculate = function (article) {
        var articleInfo = this.decision.getArticle(article);
        var rules = this.decision.getRules(article);
        var questions = this.decision.getQuestions(article);
        return {
            article: articleInfo,
            rules: rules,
            questions: questions,
            fee: 0,
            trace: [],
            success: true
        };
    };
    return CalculationEngine;
}());
exports.CalculationEngine = CalculationEngine;
