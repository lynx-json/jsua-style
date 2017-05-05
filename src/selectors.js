import {
  matches
} from "./util";

import {
  previousSiblings,
  nextSiblings
} from "./mappers";

export function firstChild(selector) {
  selector = selector || "*";
  return function (element) {
    if (!element.parentElement) return false;
    if (!matches(selector, element)) return false;

    for (let s of previousSiblings()(element)) {
      if (matches(selector, s)) return false;
    }

    return true;
  };
}

export function lastChild(selector) {
  selector = selector || "*";
  return function (element) {
    if (!element.parentElement) return false;
    if (!matches(selector, element)) return false;

    for (let s of nextSiblings()(element)) {
      if (matches(selector, s)) return false;
    }

    return true;
  };
}

export function nthChild(index, selector) {
  selector = selector || "*";
  return function (element) {
    if (!element.parentElement) return false;
    if (!matches(selector, element)) return false;

    var count = 0;
    for (let s of previousSiblings()(element)) {
      if (matches(selector, s)) count += 1;
    }

    return count === index;
  };
}

export function first(selector) {
  selector = selector || "*";

  var found = false;
  return function (element) {
    if (found) return false;

    if (matches(selector, element)) {
      found = true;
      return true;
    }
  }
}
