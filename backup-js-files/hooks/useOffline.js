"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOffline = useOffline;
function useOffline() {
    return { offline: !navigator.onLine };
}
