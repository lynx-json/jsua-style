function matches(selector, element) {
  if (typeof selector === "function") return selector(element);
  
  var matches = element.matches ||
      element.msMatchesSelector ||
      element.webkitMatchesSelector ||
      element.mozMatchesSelector ||
      element.oMatchesSelector;
      
  return matches.call(element, selector);
}

function executeFunctionOrArrayOfFunctions(fn, element) {
  if (Array.isArray(fn)) {
    return fn.forEach(f => executeFunctionOrArrayOfFunctions(f, element));
  }
  
  fn(element);
}

function* filter(selector, selection) {
  for (var e of selection) {
    if (matches(selector, e)) yield e;
  }
}

function each(fn, selection) {
  var executedElements = [];
  for (let el of filter(el => el !== null && executedElements.indexOf(el) === -1, selection)) {
    executeFunctionOrArrayOfFunctions(fn, el);
    executedElements.push(el);
  }
}

function* select(selector, selection) {
  for (let e of selection) {
    if (!e) continue;
    if (matches(selector, e)) {
      yield e;
    }
    
    if (typeof selector === "function") {
      for (let descendant of e.querySelectorAll("*")) {
        if (selector(descendant)) yield descendant;
      }
    } else {
      yield* e.querySelectorAll(selector);
    }
  }
}

function* map(fn, selection) {
  for (var e of selection) {
    let result = fn(e);
    if (!result) continue;
    if (!result[Symbol.iterator]) yield result;
    else yield* result;
  }
}

export default function query(selection) {
  if (!selection[Symbol.iterator]) {
    selection = [selection];
  }
  
  var q = {};
  
  q.each = function (fn) {
    each(fn, selection);
    return q;
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
