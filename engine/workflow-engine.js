"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkflow = getWorkflow;
function getWorkflow(mode) {
    return mode === 'fast'
        ? ['service', 'field', 'amount', 'result']
        : ['service', 'field', 'expertType', 'questions', 'modifiers', 'result'];
}
