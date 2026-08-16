"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeProvider = void 0;
var articles_json_1 = require("../../../knowledge/articles.json");
var rules_json_1 = require("../../../knowledge/rules.json");
var questions_json_1 = require("../../../knowledge/questions.json");
var workflow_json_1 = require("../../../knowledge/workflow.json");
var KnowledgeProvider = /** @class */ (function () {
    function KnowledgeProvider() {
    }
    KnowledgeProvider.prototype.getArticles = function () {
        return articles_json_1.default;
    };
    KnowledgeProvider.prototype.getRules = function () {
        return rules_json_1.default;
    };
    KnowledgeProvider.prototype.getQuestions = function () {
        return questions_json_1.default;
    };
    KnowledgeProvider.prototype.getWorkflows = function () {
        return workflow_json_1.default;
    };
    return KnowledgeProvider;
}());
exports.KnowledgeProvider = KnowledgeProvider;
