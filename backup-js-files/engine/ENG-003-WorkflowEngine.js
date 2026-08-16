"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEngine = void 0;
var DecisionEngine_1 = require("./DecisionEngine");
var WorkflowEngine = /** @class */ (function () {
    function WorkflowEngine() {
        this.decision = new DecisionEngine_1.DecisionEngine();
    }
    WorkflowEngine.prototype.start = function (article) {
        return this.decision.getWorkflow(article);
    };
    return WorkflowEngine;
}());
exports.WorkflowEngine = WorkflowEngine;
