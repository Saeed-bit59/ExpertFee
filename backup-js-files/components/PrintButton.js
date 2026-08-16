"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PrintButton;
function PrintButton() {
    return <button onClick={function () { return window.print(); }}>چاپ</button>;
}
