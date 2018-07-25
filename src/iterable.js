function createNodeListIterator(nodeList) {
  var index = 0;
  return {
    next: function () {
      var child = nodeList.item(index++);
      if (child) {
        return {
          done: false,
          value: child
        };
      } else {
        return {
          done: true
        };
      }
    }
  };
}

function createFilterIterator(sourceIterable, predicate, thisArg) {
  var index = 0;
  var iterator = sourceIterable[Symbol.iterator]();

  function nextFn() {
    var next = iterator.next();
    while (next.done === false) {
      if (predicate.call(thisArg, next.value, index++, sourceIterable)) {
        return {
          done: false,
          value: next.value
        };
      }

      next = iterator.next();
    }

    return {
      done: true
    };
  }

  return {
    next: nextFn
  };
}

function createMapIterator(sourceIterable, mapper, thisArg) {
  var index = 0;
  var iterator = sourceIterable[Symbol.iterator]();

  function nextFn() {
    var next = iterator.next();

    if (next.done === false) {
      return {
        done: false,
        value: mapper.call(thisArg, next.value, index++, sourceIterable)
      };
    }

    return {
      done: true
    };
  }

  return {
    next: nextFn
  };
}

function createReduceIterator(sourceIterable, reducer, initialValue, thisArg) {
  var index = 0;
  var iterator = sourceIterable[Symbol.iterator]();
  var previousValue = initialValue;

  function nextFn() {
    var next = iterator.next();

    if (next.done) {
      return {
        done: true
      };
    }

    while (next.done === false) {
      previousValue = reducer.call(thisArg, next.value, previousValue, index++, sourceIterable);
      next = iterator.next();
    }

    return {
      done: false,
      value: previousValue
    };
  }

  return {
    next: nextFn
  };
}

function createEmptyIterator() {
  return {
    next: function () {
      return {done: true};
    }
  };
}

function createArrayIterator(array) {
  var index = 0;

  return {
    next: function () {
      var child = array[index++];
      if (child) {
        return {
          done: false,
          value: child
        };
      } else {
        return {
          done: true
        };
      }
    }
  };
}

function Iterable(source) {
  var iteratorFn;

  if (Array.isArray(source)) {
    iteratorFn = function () {
      return createArrayIterator(source);
    };
  } else if (source && "item" in source && typeof(source.item === "function")) {
    iteratorFn = function () {
      return createNodeListIterator(source);
    };
  } else if (typeof source === "function") {
    iteratorFn = source;
  } else {
    iteratorFn = createEmptyIterator;
  }

  this[Symbol.iterator] = iteratorFn;
}

Iterable.prototype.filter = function (predicate) {
  var source = this;
  var thisArg = arguments[1];

  return new Iterable(function () {
    return createFilterIterator(source, predicate, thisArg);
  });
};

Iterable.prototype.forEach = function (callback) {
  var iterator = this[Symbol.iterator]();

  var index = 0;
  var next = iterator.next();

  var thisArg = arguments[1];

  while (next.done === false) {
    callback.call(thisArg, next.value, index++, this);
    next = iterator.next();
  }
};

Iterable.prototype.find = function (callback) {
  var source = this;

  var thisArg = arguments[1];
  var filter = createFilterIterator(source, callback, thisArg);
  return filter.next().value;
};

Iterable.prototype.first = function () {
  return this[Symbol.iterator]().next().value;
};

Iterable.prototype.last = function () {
  var a = this.array();
  if (a.length === 0) return;

  return a[a.length - 1];
};

Iterable.prototype.count = function () {
  var count = 0;
  this.forEach(function () {
    count++;
  });

  return count;
};

Iterable.prototype.some = function (predicate) {
  var source = this;
  if(!predicate) return !source[Symbol.iterator]().next().done;
  var thisArg = arguments[1];
  var filter = createFilterIterator(source, predicate, thisArg);

  return filter.next().done === false;
};

Iterable.prototype.every = function (predicate) {
  var iterator = this[Symbol.iterator]();

  var next = iterator.next();
  var index = 0;
  var thisArg = arguments[1];
  while (next.done === false) {
    if (!predicate.call(thisArg, next.value, index++, this)) {
      return false;
    }

    next = iterator.next();
  }

  return true;
};

Iterable.prototype.concat = function (iterable) {
  var firstIterator = this[Symbol.iterator];

  var concatIteratorFn = function () {
    var first = firstIterator();
    var second = iterable[Symbol.iterator]();

    return {
      next: function () {
        var next = first.next();
        if (!next.done) return next;
        return second.next();
      }
    };
  };

  return new Iterable(concatIteratorFn);
};

Iterable.prototype.map = function (mapper) {
  var source = this;
  var thisArg = arguments[1];

  return new Iterable(function () {
    return createMapIterator(source, mapper, thisArg);
  });
};

Iterable.prototype.reduce = function (reducer, initialValue) {
  var source = this;
  var thisArg = arguments[1];

  return new Iterable(function () {
    return createReduceIterator(source, reducer, initialValue, thisArg);
  });
};

Iterable.prototype.unique = function () {
  var items = [];
  return this.filter(function (item) {
    if (items.indexOf(item) === -1) {
      items.push(item);
      return true;
    }

    return false;
  });
};

Iterable.prototype.array = function () {
  var result = [];

  this.forEach(function (item) {
    result.push(item);
  });

  return result;
};

module.exports = exports = Iterable;
