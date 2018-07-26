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

  return function (el) {
    var result = [];
    var previousSibling = el.previousElementSibling;

    while (previousSibling) {
      if (matches(selector, previousSibling)) result.push(previousSibling);
      previousSibling = previousSibling.previousElementSibling;
    }

    return result;
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

  return function (el) {
    var result = [];
    var nextSibling = el.nextElementSibling;

    while (nextSibling) {
      if (matches(selector, nextSibling)) result.push(nextSibling);
      nextSibling = nextSibling.nextElementSibling;
    }

    return result;
  };
}

export function ancestors(selector) {
  selector = selector || "*";

  return function (el) {
    var result = [];
    var ancestor = el.parentElement;

    while (ancestor) {
      if (matches(selector, ancestor)) result.push(ancestor);
      ancestor = ancestor.parentElement;
    }

    return result;
  };
}

export function descendants(selector) {
  selector = selector || "*";

  return function (el) {
    var result = [];
    if (typeof selector === "function") {
      for (let descendant of el.querySelectorAll("*")) {
        if (selector(descendant)) result.push(descendant);
      }
    } else {
      for (let descendant of el.querySelectorAll(selector)) {
        result.push(descendant);
      };
    }

    return result;
  };
}

export function realChildren(selector, excludeFilter) {
  selector = selector || "*";

  function getChildren(el) {
    var result = [];

    for (var i = 0, max = el.children.length; i < max; i++) {
      let child = el.children[i];
      if (child.getAttribute("role") === "presentation") {
        for (let c of getChildren(child)) {
          result.push(c);
        }
      } else if (excludeFilter && matches(excludeFilter, child)) {
        for (let c of getChildren(child)) {
          result.push(c);
        }
      } else if (matches(selector, child)) {
        result.push(child);
      }
    }

    return result;
  }

  return function (el) {
    return getChildren(el);
  };
}

export function children(selector) {
  selector = selector || "*";

  function getChildren(el) {
    var result = [];
    for (var i = 0, max = el.children.length; i < max; i++) {
      let child = el.children[i];
      if (matches(selector, child)) {
        result.push(child);
      }
    }

    return result;
  }

  return function (el) {
    return getChildren(el);
  };
}

export function realParent(selector, excludeFilter) {
  selector = selector || "*";

  return function (el) {
    while (el = el.parentElement) {
      let exclude = el.getAttribute("role") === "presentation" || (excludeFilter && matches(excludeFilter, el));
      if (!exclude && matches(selector, el)) {
        return el;
      } else if (!exclude) {
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

// TODO: TEST
export function component(name) {
  var selector = name ? `[data-jsua-style-component~='${name}']` : "[data-jsua-style-component]";

  return first(ancestors(selector))
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
  function getResults(el) {
    var result = [];
    var matches = query(el).map(mapper).toArray();
    for (var i = 1, max = matches.length + 1; i < max; i++) {
      if (i % 2 === 0) {
        result.push(matches[i - 1]);
      }
    }
    return result;
  }

  return function (el) {
    return Array.from(getResults(el));
  };
}

export function odd(mapper) {
  function getResults(el) {
    var result = [];
    var matches = query(el).map(mapper).toArray();
    for (var i = 1, max = matches.length + 1; i < max; i++) {
      if (i % 2 !== 0) {
        result.push(matches[i - 1]);
      }
    }

    return result;
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
