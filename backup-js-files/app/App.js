"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var Header_1 = require("./components/Header");
var Footer_1 = require("./components/Footer");
var HomePage_1 = require("./pages/HomePage");
function App() {
    return (<>

            <Header_1.default />

            <HomePage_1.default />

            <Footer_1.default />

        </>);
}
