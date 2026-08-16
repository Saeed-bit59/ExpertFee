"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRules = applyRules;
function applyRules(ctx, rules) {
    var trace = [];
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var r = rules_1[_i];
        trace.push(r.id);
    }
    return { ctx: ctx, trace: trace };
}
