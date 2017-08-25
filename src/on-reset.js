import { executeFunctionOrArrayOfFunctions } from "./util";

export default function onReset(fn) {
  return function (element) {
    var existingFn = element.jsuaStyleReset;

    if (!existingFn) {
      element.jsuaStyleReset = function () {
        element.removeAttribute("style");
        element.removeAttribute("class");
        element.removeAttribute("data-jsua-context");

        executeFunctionOrArrayOfFunctions(fn, element);
      };
    } else {
      element.jsuaStyleReset = function () {
        existingFn();
        executeFunctionOrArrayOfFunctions(fn, element);
      };
    }
  };
}
