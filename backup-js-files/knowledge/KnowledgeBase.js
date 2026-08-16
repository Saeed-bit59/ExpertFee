"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBase = void 0;
var KnowledgeBase = /** @class */ (function () {
    function KnowledgeBase() {
        this.articles = [];
    }
    KnowledgeBase.prototype.load = function (data) {
        this.articles = data;
    };
    KnowledgeBase.prototype.getArticle = function (article) {
        return this.articles.find(function (a) { return a.article === article; });
    };
    KnowledgeBase.prototype.getAll = function () {
        return this.articles;
    };
    return KnowledgeBase;
}());
exports.KnowledgeBase = KnowledgeBase;
