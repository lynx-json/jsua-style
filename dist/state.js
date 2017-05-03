"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setState = setState;
exports.clearState = clearState;
exports.when = when;

var _util = require("./util");

function setupState(element) {
  var states = [];

  element.jsuaStyleHasState = function (state) {
    return states.includes(state);
  };

  element.jsuaStyleSetState = function (state) {
    if (!states.includes(state)) {
      states.push(state);
    }
  };

  element.jsuaStyleClearState = function (state) {
    var index = states.indexOf(state);

    if (index > -1) {
      states.splice(index, 1);
    }
  };
}

function hasState(element) {
  return !!element.jsuaStyleHasState;
}

function raiseChangeEvent(element) {
  var evt = document.createEvent("Event");
  evt.initEvent("jsua-style-state-change", false, false);
  element.dispatchEvent(evt);
}

function setState(state) {
  return function (element) {
    if (!hasState(element)) {
      setupState(element);
    }

    element.jsuaStyleSetState(state);

    raiseChangeEvent(element);
  };
}

function clearState(state) {
  return function (element) {
    if (!hasState(element)) {
      setupState(element);
    }

    element.jsuaStyleClearState(state);

    raiseChangeEvent(element);
  };
}

function when(state, fn) {
  return function (element) {
    element.addEventListener("jsua-style-state-change", function (e) {
      if (element.jsuaStyleHasState(state)) {
        (0, _util.executeFunctionOrArrayOfFunctions)(fn, element, e);
      }
    });
  };
}