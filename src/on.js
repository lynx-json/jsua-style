import { executeFunctionOrArrayOfFunctions } from "./util";

import onReset from "./on-reset";

export function on(name, fn) {
  return function (el) {
    function handler(e) {
      executeFunctionOrArrayOfFunctions(fn, el, e);
    }

    onReset(el => el.removeEventListener(name, handler))(el);
    el.addEventListener(name, handler);
  };
}
