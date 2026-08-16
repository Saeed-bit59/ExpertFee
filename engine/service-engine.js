"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getService = getService;
function getService(id, catalog) {
    return catalog.find(function (s) { return s.id === id; });
}
