import {
  executeFunctionOrArrayOfFunctions,
  matches
} from "./util";

var Iterable = require("./iterable");
import { createSelectIterator, createMapperIterator } from "./iterators";

function filter(selector, selection) {
  return selection.filter(e => matches(selector, e));
}

function each(fn, selection) {
  var executedElements = [];

  for (let el of filter(el => el !== null && executedElements.indexOf(el) === -1, selection)) {
    executeFunctionOrArrayOfFunctions(fn, el);
    executedElements.push(el);
  }

  return executedElements;
}

function select(selector, selection) {
  return new Iterable(() => createSelectIterator(selector, selection));
}

function map(fn, selection) {
  return new Iterable(() => createMapperIterator(fn, selection));
}

export default function query(selection) {
  if (selection.querySelector) {
    selection = new Iterable([selection]);
  } else if (Array.isArray(selection)) {
    selection = new Iterable(selection);
  }

  var q = {};

  q.each = function (fn) {
    selection = each(fn, selection);

    return q;
  };

  q.toArray = function () {
    var a = [];
    each(el => a.push(el), selection);
    return a;
  };

  q.select = function (selector) {
    selection = select(selector, selection);
    return q;
  };

  q.map = function (mapFn) {
    selection = map(mapFn, selection);
    return q;
  };

  q.filter = function (selector) {
    selection = filter(selector, selection);
    return q;
  };

  return q;
}
