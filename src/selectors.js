import {
  matches
} from "./util";

// import mappers from "./mappers";

function* previousSiblings(el) {
  var previousSibling = el.previousElementSibling;

  while (previousSibling) {
    yield previousSibling;
    previousSibling = previousSibling.previousElementSibling;
  }
}

function* nextSiblings(el) {
  var nextSibling = el.nextElementSibling;

  while (nextSibling) {
    yield nextSibling;
    nextSibling = nextSibling.nextElementSibling;
  }
}

export function firstChild(selector) {
  selector = selector || "*";
  return function (element) {
    if (!element.parentElement) return false;
    if (!matches(selector, element)) return false;

    for (let s of previousSiblings(element)) {
      if (matches(selector, s)) return false;
    }

    return true;
  }
}

export function lastChild(selector) {
  selector = selector || "*";
  return function (element) {
    if (!element.parentElement) return false;
    if (!matches(selector, element)) return false;

    for (let s of nextSiblings(element)) {
      if (matches(selector, s)) return false;
    }

    return true;
  }
}

export function nthChild(index, selector) {
  selector = selector || "*";
  return function (element) {
    if (!element.parentElement) return false;
    if (!matches(selector, element)) return false;

    var count = 0;
    for (let s of previousSiblings(element)) {
      if (matches(selector, s)) count += 1;
    }

    return count === index;
  }
}
