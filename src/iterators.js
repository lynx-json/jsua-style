var Iterable = require("./iterable");

import { matches } from "./util";

function createElementSelectIterator(selector, element) {
  var resultsIterator;

  function next() {
    if (!resultsIterator) {
      if (typeof selector === "function") {
        resultsIterator = new Iterable(element.querySelectorAll("*")).filter(el => matches(selector, el))[Symbol.iterator]();
      } else {
        resultsIterator = new Iterable(element.querySelectorAll(selector))[Symbol.iterator]();
      }

      if (matches(selector, element)) {
        return {
          done: false,
          value: element
        };
      }
    }

    return resultsIterator.next();
  }

  return {
    next: next
  };
}

export function createMapperIterator(fn, selection) {
  var sourceIterator = selection[Symbol.iterator]();
  var currentIterator;

  function next() {
    if (fn === null || fn === undefined) return { done: true };

    if (currentIterator) {
      var nextResult = currentIterator.next();

      if (nextResult.done === false) {
        return nextResult;
      }
    }

    var sourceNext = sourceIterator.next();

    while (sourceNext.done === false) {
      let result = fn(sourceNext.value);

      if (!result) {
        sourceNext = sourceIterator.next();
        continue;
      }

      if (result.tagName) {
        return {
          done: false,
          value: result
        };
      }

      currentIterator = new Iterable(result)[Symbol.iterator]();
      var next = currentIterator.next();
      if (!next.done) {
        return next;
      } else {
        sourceNext = sourceIterator.next();
      }
    }

    return {
      done: true
    };
  }

  return {
    next: next
  };
}

export function createSelectIterator(selector, selection) {
  var sourceIterator = selection[Symbol.iterator]();
  var currentIterator;

  function next() {
    if (currentIterator) {
      var nextResult = currentIterator.next();

      if (nextResult.done === false) {
        return {
          done: false,
          value: nextResult.value
        };
      }
    }

    var sourceNext = sourceIterator.next();

    if (sourceNext.done === false) {
      currentIterator = createElementSelectIterator(selector, sourceNext.value);
      return currentIterator.next();
    }

    return {
      done: true
    };
  }

  return {
    next: next
  };
}
