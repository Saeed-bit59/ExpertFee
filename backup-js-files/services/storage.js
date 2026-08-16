"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
exports.storage = {
    save: function (k, v) { return localStorage.setItem(k, JSON.stringify(v)); },
    load: function (k) { return JSON.parse(localStorage.getItem(k) || "null"); }
};
