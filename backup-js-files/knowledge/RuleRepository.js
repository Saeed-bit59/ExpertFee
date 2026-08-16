"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleRepository = void 0;
var RuleRepository = /** @class */ (function () {
    function RuleRepository() {
        this.rules = [];
    }
    RuleRepository.prototype.load = function (data) {
        this.rules = data;
    };
    RuleRepository.prototype.getAll = function () {
        return this.rules;
    };
    RuleRepository.prototype.byArticle = function (article) {
        return this.rules.filter(function (r) { return r.article === article; });
    };
    return RuleRepository;
}());
exports.RuleRepository = RuleRepository;
