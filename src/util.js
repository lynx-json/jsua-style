export function executeFunctionOrArrayOfFunctions(fn, element, evt) {
  if (Array.isArray(fn)) {
    return fn.forEach(f => executeFunctionOrArrayOfFunctions(f, element, evt));
  }

  fn(element, evt);
}

export function matches(selector, element) {
  if (typeof selector === "function") return selector(element);
  return element.matches(selector);
}
