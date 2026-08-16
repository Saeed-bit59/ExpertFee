"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculationEngine = calculationEngine;
function calculationEngine(input, rules) {
    var _a;
    var fee = 0;
    var trace = [];
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var r = rules_1[_i];
        trace.push((_a = r.id) !== null && _a !== void 0 ? _a : 'rule');
    }
    return { fee: fee, trace: trace };
}
