import {matches} from "./util";

export function previousSiblings() {
  return function* (el) {
    var previousSibling = el.previousElementSibling;

    while (previousSibling) {
      yield previousSibling;
      previousSibling = previousSibling.previousElementSibling;
    }
  };
}

export function nextSiblings(selector) {
  selector = selector || "*";
  
  return function* (el) {
    var nextSibling = el.nextElementSibling;

    while (nextSibling) {
      if (matches(selector, nextSibling)) yield nextSibling;
      nextSibling = nextSibling.nextElementSibling;
    }
  };
}

export function ancestors(selector) {
  selector = selector || "*";
  
  return function* (el) {
    var ancestor = el.parentElement;

    while (ancestor) {
      if (matches(selector, ancestor)) yield ancestor;
      ancestor = ancestor.parentElement;
    }
  };
}

export function realChildren(selector) {
  selector = selector || "*";
  
  function* getChildren(el) {
    for (var i = 0, max = el.children.length; i < max; i++) {
      let child = el.children[i];
      if (child.getAttribute("role") === "presentation") {
        yield* getChildren(child);
      } else if (matches(selector, child)) {
        yield child;
      }
    }
  }

  return function (el) {
    // We can't return the iterable directly,
    // because it's possible that the structure changes
    // as a result of styling.
    return Array.from(getChildren(el));
  };
}

export function children(selector) {
  selector = selector || "*";
  
  function* getChildren(el) {
    for (var i = 0, max = el.children.length; i < max; i++) {
      let child = el.children[i];
      if (matches(selector, child)) {
        yield child;
      }
    }
  }

  return function (el) {
    // We can't return the iterable directly,
    // because it's possible that the structure changes
    // as a result of styling.
    return Array.from(getChildren(el));
  };
}

export function realParent(selector) {
  selector = selector || "*";
  
  return function (el) {
    while (el = el.parentElement) {
      if (el.getAttribute("role") !== "presentation" && matches(selector, el)) {
        return el;
      }
    }

    return null;
  };
}

export function parent(selector) {
  selector = selector || "*";
  
  return function (el) {
    if (el.parentElement && matches(selector, el.parentElement)) {
      return el.parentElement;
    }

    return null;
  };
}

export function slot(name) {
  return function (el) {
    return el.jsuaStyleGetSlot && el.jsuaStyleGetSlot(name);
  };
}
