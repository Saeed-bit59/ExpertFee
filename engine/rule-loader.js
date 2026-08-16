"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRuleSet = loadRuleSet;
function loadRuleSet(id, sets) {
    return sets.find(function (x) { return x.id === id; });
}
