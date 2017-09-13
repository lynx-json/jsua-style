import { matches } from "./util";
import query from "./query";

//TODO: Test
export function previousSibling(selector) {
  selector = selector || "*";

  return function (el) {
    var previousSibling = el.previousElementSibling;

    if (previousSibling && matches(selector, previousSibling)) {
      return previousSibling;
    }
  };
}

// TODO: Test
export function previousRealSibling(selector) {
  selector = selector || "*";

  return function (el) {
    var siblings = query(el).map(realParent()).map(realChildren()).toArray();

    if (siblings.length > 0) {
      let index = siblings.indexOf(el);
      var matches = query(siblings).filter(el => siblings.indexOf(el) < index).filter(selector).toArray();
      if (matches.length > 0) {
        return matches[matches.length - 1];
      }
    }
  }
}

export function previousSiblings(selector) {
  selector = selector || "*";

  return function* (el) {
    var previousSibling = el.previousElementSibling;

    while (previousSibling) {
      if (matches(selector, previousSibling)) yield previousSibling;
      previousSibling = previousSibling.previousElementSibling;
    }
  };
}

// TODO: Test
export function nextSibling(selector) {
  selector = selector || "*";

  return function (el) {
    var nextSibling = el.nextElementSibling;

    if (nextSibling && matches(selector, nextSibling)) {
      return nextSibling;
    }
  };
}

// TODO: Test
export function nextRealSibling(selector) {
  selector = selector || "*";

  return function (el) {
    var siblings = query(el).map(realParent()).map(realChildren()).toArray();

    if (siblings.length > 0) {
      let index = siblings.indexOf(el);
      var matches = query(siblings).filter(el => siblings.indexOf(el) > index).filter(selector).toArray();
      if (matches.length > 0) {
        return matches[0];
      }
    }
  }
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

export function descendants(selector) {
  selector = selector || "*";

  return function* (el) {
    if (typeof selector === "function") {
      for (let descendant of el.querySelectorAll("*")) {
        if (selector(descendant)) yield descendant;
      }
    } else {
      yield* el.querySelectorAll(selector);
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
      } else if (el.getAttribute("role") !== "presentation") {
        break;
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

export function slot(slotName, componentName) {
  return function (el) {
    return el.jsuaStyleGetSlot && el.jsuaStyleGetSlot(slotName, componentName);
  };
}

export function wrapper() {
  return function (el) {
    var wrapperElement = document.createElement("div");
    wrapperElement.setAttribute("role", "presentation");

    el.parentElement.replaceChild(wrapperElement, el);
    wrapperElement.appendChild(el);

    return wrapperElement;
  };
}

export function first(mapper) {
  return function (el) {
    var matches = query(el).map(mapper).toArray();
    return matches.length > 0 && matches[0];
  };
}

export function nth(number, mapper) {
  return function (el) {
    var matches = query(el).map(mapper).toArray();
    return matches.length >= number && matches[number - 1];
  };
}

export function even(mapper) {
  function* getResults(el) {
    var matches = query(el).map(mapper).toArray();
    for (var i = 1, max = matches.length + 1; i < max; i++) {
      if (i % 2 === 0) {
        yield matches[i - 1];
      }
    }
  }

  return function (el) {
    return Array.from(getResults(el));
  };
}

export function odd(mapper) {
  function* getResults(el) {
    var matches = query(el).map(mapper).toArray();
    for (var i = 1, max = matches.length + 1; i < max; i++) {
      if (i % 2 !== 0) {
        yield matches[i - 1];
      }
    }
  }

  return function (el) {
    return Array.from(getResults(el));
  };
}

export function last(mapper) {
  return function (el) {
    var matches = query(el).map(mapper).toArray();
    return matches.length > 0 && matches[matches.length - 1];
  };
}
