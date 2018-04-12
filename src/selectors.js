import {
  matches,
  hasToken
} from "./util";

import {
  previousSiblings,
  previousRealSibling,
  nextSiblings,
  nextRealSibling,
  realChildren,
  children,
  parent,
  realParent
} from "./mappers";

import query from "./query";

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

// TODO: Test
export function firstRealChild() {
  return not(has(previousRealSibling()));
}

// TODO: Test
export function lastRealChild() {
  return not(has(nextRealSibling()));
}

// TODO: Test
export function nthRealChild(number, selector) {
  selector = selector || "*";
  return function (el) {
    var siblings = query(el).map(realParent()).map(realChildren()).toArray();

    if (siblings.length > 0) {
      let index = siblings.indexOf(el);
      var matches = query(siblings).filter(el => siblings.indexOf(el) < index).filter(selector).toArray();
      return matches.length === number - 1;
    }

    return false;
  };
}

export function not(selector) {
  selector = selector || "*";

  return function (element) {
    if (matches(selector, element)) {
      return false;
    }

    return true;
  };
}

// TODO: Test
export function or(selectors) {
  return function (element) {
    for (var i = 0; i < selectors.length; i++) {
      if (matches(selectors[i], element)) {
        return true;
      }
    }

    return false;
  };
}

// TODO: Test
export function and(selectors) {
  return function (element) {
    for (var i = 0; i < selectors.length; i++) {
      if (!matches(selectors[i], element)) {
        return false;
      }
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

// Obsolete
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

export function has(mapperOrNumber, mapper) {
  var number;
  if (typeof mapperOrNumber === "number") {
    number = mapperOrNumber;
  } else {
    mapper = mapperOrNumber;
  }

  return function (element) {
    var matches = query(element).map(mapper).toArray();

    if (number !== undefined) {
      return matches.length === number;
    }

    return matches.length > 0;
  }
}

export function hasOne(mapper) {
  return function (element) {
    var matches = query(element).map(mapper).toArray();
    return matches.length === 1;
  }
}

export function matchesMedia(mediaQuery) {
  return function (el) {
    if (window.matchMedia(mediaQuery).matches) return el;
  };
}

// Obsolete
export function hasParent(selector) {
  selector = selector || "*";
  return function (element) {
    var matchingParent = parent(selector)(element);
    return !!matchingParent;
  };
}

// Obsolete
export function hasRealParent(selector) {
  selector = selector || "*";
  return function (element) {
    var matchingParent = realParent(selector)(element);

    return !!matchingParent;
  };
}

export function isHidden() {
  return function (element) {
    return element.jsuaStyleHasState && element.jsuaStyleHasState("visibility", "hidden");
  }
}

// TODO: Test
export function hasState(state, value) {
  return function (element) {
    return element.jsuaStyleHasState && element.jsuaStyleHasState(state, value);
  }
}

export function unlocked(key, selector) {
  if (!selector) {
    selector = key;
    key = null;
  }

  key = key || "style";
  selector = selector || "*";

  return function (element) {
    if (!matches(selector, element)) return false;
    return !hasToken(element, "data-jsua-style-lock", key);
  }
}
