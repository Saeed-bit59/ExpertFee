"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextStep = nextStep;
function nextStep(current, tree) {
    var node = tree.nodes.find(function (n) { return n.id === current; });
    return node ? node.next : null;
}
