import {
  executeFunctionOrArrayOfFunctions
} from "./util";

function setupState(element) {
  var states = {};

  element.jsuaStyleHasState = function (state, value) {
    if (value === undefined) value = true;
    return state in states && states[state] === value;
  };

  element.jsuaStyleSetState = function (state, value) {
    if (value === undefined) value = true;
    states[state] = value;
  };

  element.jsuaStyleClearState = function (state) {
    delete states[state];
  };
}

function isTrackingState(element) {
  return !!element.jsuaStyleHasState;
}

function raiseChangeEvent(element, state, cleared) {
  var evt = document.createEvent("Event");
  evt.initEvent("jsua-style-state-change", false, false);
  evt.jsuaStyleState = state;
  evt.jsuaStyleStateCleared = !!cleared;

  element.dispatchEvent(evt);
}

export function setState(state, value) {
  return function (element) {
    if (!isTrackingState(element)) {
      setupState(element);
    }

    if (element.jsuaStyleHasState(state, value)) return;

    element.jsuaStyleSetState(state, value);
    raiseChangeEvent(element, state);
  };
}

// TODO: Test
export function toggleState(state) {
  return function (element) {
    if (!isTrackingState(element)) {
      setupState(element);
    }

    if (element.jsuaStyleHasState(state)) {
      clearState(state)(element);
    } else {
      setState(state)(element);
    }
  };
}

export function clearState(state) {
  return function (element) {
    if (!isTrackingState(element)) {
      setupState(element);
    }

    if (!element.jsuaStyleHasState(state)) return;

    element.jsuaStyleClearState(state);
    raiseChangeEvent(element, state, true);
  };
}

export function when(state, valueOrFn, fn) {
  var value = true;
  if (fn === undefined && (typeof valueOrFn === "function" || Array.isArray(valueOrFn))) {
    fn = valueOrFn;
  } else {
    value = valueOrFn;
  }

  return function (element) {
    if (element.jsuaStyleHasState && element.jsuaStyleHasState(state, value)) {
      executeFunctionOrArrayOfFunctions(fn, element);
    }
    element.addEventListener("jsua-style-state-change", function (e) {
      if (element.jsuaStyleHasState(state, value)) {
        executeFunctionOrArrayOfFunctions(fn, element, e);
      }
    });
  };
}

export function whenNot(state, valueOrFn, fn) {
  var value = true;
  if (fn === undefined && (typeof valueOrFn === "function" || Array.isArray(valueOrFn))) {
    fn = valueOrFn;
  } else {
    value = valueOrFn;
  }

  return function (element) {
    if (!element.jsuaStyleHasState || !element.jsuaStyleHasState(state, value)) {
      executeFunctionOrArrayOfFunctions(fn, element);
    }
    element.addEventListener("jsua-style-state-change", function (e) {
      if (!element.jsuaStyleHasState(state, value)) {
        executeFunctionOrArrayOfFunctions(fn, element, e);
      }
    });
  };
}
