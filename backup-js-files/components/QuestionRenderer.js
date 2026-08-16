"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuestionRenderer;
function QuestionRenderer(_a) {
    var question = _a.question;
    switch (question.type) {
        case 'number': return <input type='number'/>;
        case 'select': return <select />;
        case 'boolean': return <input type='checkbox'/>;
        default: return <input />;
    }
}
