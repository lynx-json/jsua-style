"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = on;

var _util = require("./util");

function on(name, fn) {
  return function (el) {
    el.addEventListener(name, function (e) {
      (0, _util.executeFunctionOrArrayOfFunctions)(fn, el, e);
    });
  };
}