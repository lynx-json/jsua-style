export function executeFunctionOrArrayOfFunctions(fn, element, evt) {
  if (Array.isArray(fn)) {
    return fn.forEach(f => executeFunctionOrArrayOfFunctions(f, element, evt));
  }

  if (typeof fn !== "function") {
    console.error("Attempting to execute a non-function:", fn);
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

function getTokens(view, attributeName) {
  var tokens = view.getAttribute(attributeName);
  return tokens ? tokens.split(" ") : [];
}

function setTokens(view, attributeName, tokens) {
  tokens = tokens || [];
  view.setAttribute(attributeName, tokens.join(" "));
}

export function addToken(element, attributeName, token) {
  var tokens = getTokens(element, attributeName);
  if (tokens.indexOf(token) > -1) return;
  tokens.push(token);
  setTokens(element, attributeName, tokens);
}

export function applyAdjustments() {
  function apply(element) {
    var evt = document.createEvent("Event");
    evt.initEvent("jsua-style-adjust", false, false);
    element.dispatchEvent(evt);
  }

  Array.from(document.body.querySelectorAll("[data-jsua-style-adjust]")).reverse().forEach(apply);
}
