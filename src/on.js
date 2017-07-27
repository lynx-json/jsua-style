import { executeFunctionOrArrayOfFunctions } from "./util";

export function on(name, fn) {
  return function (el) {
    function handler(e) {
      executeFunctionOrArrayOfFunctions(fn, el, e);
    }

    var previousFn = el[`jsuaStyleOff${name}`];

    el[`jsuaStyleOff${name}`] = function () {
      el.removeEventListener(name, handler);

      if (previousFn) {
        previousFn();
      }
    }

    el.addEventListener(name, handler);
  };
}

export function off(name) {
  return function (el) {
    if (el[`jsuaStyleOff${name}`]) {
      el[`jsuaStyleOff${name}`]();
    }
  };
}
