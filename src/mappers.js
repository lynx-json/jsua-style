export function previousSiblings() {
  return function* (el) {
    var previousSibling = el.previousElementSibling;

    while (previousSibling) {
      yield previousSibling;
      previousSibling = previousSibling.previousElementSibling;
    }
  };
}

export function nextSiblings() {
  return function* (el) {
    var nextSibling = el.nextElementSibling;

    while (nextSibling) {
      yield nextSibling;
      nextSibling = nextSibling.nextElementSibling;
    }
  };
}

// export function siblings() {
//   return function* (el) {
//     yield* previousSiblings()(el);
//     yield* nextSiblings()(el);
//   };
// }

export function ancestors() {
  return function* (el) {
    var ancestor = el.parentElement;

    while (ancestor) {
      yield ancestor;
      ancestor = ancestor.parentElement;
    }
  };
}

export function realChildren() {
  function* getChildren(el) {
    for (var i = 0, max = el.children.length; i < max; i++) {
      let child = el.children[i];
      if (child.getAttribute("role") === "presentation") {
        yield* getChildren(child);
      } else {
        yield child;
      }
    }
  }

  return function* (el) {
    yield* getChildren(el);
  };
}

export function realParent() {
  return function (el) {
    while (el = el.parentElement) {
      if (el.getAttribute("role") !== "presentation") {
        return el;
      }
    }

    return null;
  };
}
