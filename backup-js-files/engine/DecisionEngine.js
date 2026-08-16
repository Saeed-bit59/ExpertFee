"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionEngine = void 0;
var KnowledgeProvider_1 = require("@/knowledge/KnowledgeProvider");
var DecisionEngine = /** @class */ (function () {
    function DecisionEngine() {
        this.provider = new KnowledgeProvider_1.KnowledgeProvider();
    }
    DecisionEngine.prototype.getArticle = function (article) {
        return this.provider
            .getArticles()
            .find(function (a) { return a.article === article; });
    };
    DecisionEngine.prototype.getRules = function (article) {
        return this.provider
            .getRules()
            .filter(function (r) { return r.article === article; });
    };
    DecisionEngine.prototype.getQuestions = function (article) {
        return this.provider
            .getQuestions()
            .filter(function (q) { return q.article === article; });
    };
    DecisionEngine.prototype.getWorkflow = function (article) {
        return this.provider
            .getWorkflows()
            .find(function (w) { return w.article === article; });
    };
    return DecisionEngine;
}());
exports.DecisionEngine = DecisionEngine;
