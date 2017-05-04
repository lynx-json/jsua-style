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


export function* previousSiblings(el) {
  var previousSibling = el.previousElementSibling;

  while (previousSibling) {
    yield previousSibling;
    previousSibling = previousSibling.previousElementSibling;
  }
}

export function* nextSiblings(el) {
  var nextSibling = el.nextElementSibling;

  while (nextSibling) {
    yield nextSibling;
    nextSibling = nextSibling.nextElementSibling;
  }
}
