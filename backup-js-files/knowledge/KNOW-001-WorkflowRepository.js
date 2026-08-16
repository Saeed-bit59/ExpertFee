"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowRepository = void 0;
var WorkflowRepository = /** @class */ (function () {
    function WorkflowRepository() {
        this.workflows = [];
    }
    WorkflowRepository.prototype.load = function (data) {
        this.workflows = data;
    };
    WorkflowRepository.prototype.get = function (article) {
        return this.workflows.find(function (w) { return w.article === article; });
    };
    WorkflowRepository.prototype.getAll = function () {
        return this.workflows;
    };
    return WorkflowRepository;
}());
exports.WorkflowRepository = WorkflowRepository;
