"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectWorkflow = selectWorkflow;
function selectWorkflow(service) {
    switch (service) {
        case 'valuation': return 11;
        case 'rent': return 13;
        case 'aerial': return 14;
        default: return null;
    }
}
