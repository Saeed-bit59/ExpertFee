"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
function run(ctx) {
    var fee = 0;
    var trace = [];
    for (var _i = 0, _a = ctx.rules; _i < _a.length; _i++) {
        var rule = _a[_i];
        trace.push(rule.id);
    }
    return { fee: fee, trace: trace };
}
