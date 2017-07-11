import {
  matches
} from "./util";

import {
  previousSiblings,
  nextSiblings,
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

export function not(selector) {
  selector = selector || "*";

  return function (element) {
    if (matches(selector, element)) {
      return false;
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

// Obsolete
export function hasChildren(selector) {
  selector = selector || "*";
  return function (element) {
    var matchingChildren = children(selector)(element);
    return matchingChildren.length > 0;
  };
}

// Obsolete
export function hasOneChild(selector) {
  selector = selector || "*";
  return function (element) {
    var matchingChildren = children(selector)(element);
    return matchingChildren.length === 1;
  };
}

// Obsolete
export function hasRealChildren(selector) {
  selector = selector || "*";
  return function (element) {
    var matchingChildren = realChildren(selector)(element);
    return matchingChildren.length > 0;
  };
}

// Obsolete
export function hasOneRealChild(selector) {
  selector = selector || "*";
  return function (element) {
    var matchingChildren = realChildren(selector)(element);
    return matchingChildren.length === 1;
  };
}

export function has(mapper) {
  return function (element) {
    var matches = query(element).map(mapper).toArray();
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
