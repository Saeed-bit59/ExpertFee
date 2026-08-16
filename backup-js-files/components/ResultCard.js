"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResultCard;
function ResultCard(_a) {
    var result = _a.result;
    return <div><h3>نتیجه محاسبه</h3><pre>{JSON.stringify(result, null, 2)}</pre></div>;
}
