"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeFunctionOrArrayOfFunctions = executeFunctionOrArrayOfFunctions;
function executeFunctionOrArrayOfFunctions(fn, element, evt) {
  if (Array.isArray(fn)) {
    return fn.forEach(function (f) {
      return executeFunctionOrArrayOfFunctions(f, element, evt);
    });
  }

  fn(element, evt);
}