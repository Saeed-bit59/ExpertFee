"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionRepository = void 0;
var QuestionRepository = /** @class */ (function () {
    function QuestionRepository() {
        this.questions = [];
    }
    QuestionRepository.prototype.load = function (data) {
        this.questions = data;
    };
    QuestionRepository.prototype.byArticle = function (article) {
        return this.questions.filter(function (q) { return q.article === article; });
    };
    QuestionRepository.prototype.getAll = function () {
        return this.questions;
    };
    return QuestionRepository;
}());
exports.QuestionRepository = QuestionRepository;
