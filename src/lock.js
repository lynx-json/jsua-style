import {
  addToken,
  hasToken,
  executeFunctionOrArrayOfFunctions
} from "./util";

// TODO: Consider making fn argument obsolete.
export default function lock(keyOrFn) {
  var key, fn;

  if (typeof keyOrFn === "string") {
    key = keyOrFn;
  } else {
    key = "style";
    fn = keyOrFn;
  }

  return function (element) {
    // TODO: Obsolete?
    if (fn && !hasToken(element, "data-jsua-style-lock", key)) {
      executeFunctionOrArrayOfFunctions(fn, element);
    }

    addToken(element, "data-jsua-style-lock", key);
  };
}
