"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardEngine = void 0;
var DecisionEngine_1 = require("./DecisionEngine");
var WizardEngine = /** @class */ (function () {
    function WizardEngine() {
        this.decision = new DecisionEngine_1.DecisionEngine();
    }
    WizardEngine.prototype.start = function (article) {
        var questions = this.decision.getQuestions(article);
        return {
            article: article,
            currentQuestion: questions.length
                ? questions[0].id
                : "",
            answers: {},
            finished: false
        };
    };
    return WizardEngine;
}());
exports.WizardEngine = WizardEngine;
