"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestions = getQuestions;
function getQuestions(article, bank) {
    return bank.filter(function (q) { return q.article === article; });
}
