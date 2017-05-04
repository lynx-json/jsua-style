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
