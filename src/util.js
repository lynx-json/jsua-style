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
  try {
    return element.matches(selector);
  } catch (err) {
    console.warn(`Executing selector "${selector}" resulted in an error`);
    throw err;
  }
}

export function previousSiblings(el) {
  var result = [];
  var previousSibling = el.previousElementSibling;

  while (previousSibling) {
    result.push(previousSibling);
    previousSibling = previousSibling.previousElementSibling;
  }

  return result;
}

export function nextSiblings(el) {
  var result = [];
  var nextSibling = el.nextElementSibling;

  while (nextSibling) {
    result.push(nextSibling);
    nextSibling = nextSibling.nextElementSibling;
  }

  return result;
}

function getTokens(view, attributeName) {
  var tokens = view.getAttribute(attributeName);
  return tokens ? tokens.split(" ") : [];
}

export function hasToken(view, attributeName, token) {
  var tokens = getTokens(view, attributeName);

  if (token) {
    return tokens.some(t => t === token);
  } else {
    return tokens.length > 0;
  }
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
