import { executeFunctionOrArrayOfFunctions } from "./util";

export default function on(name, fn) {
  return function (el) {
    el.addEventListener(name, function (e) {
      executeFunctionOrArrayOfFunctions(fn, el, e);
    });
  }
}
