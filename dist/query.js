"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = query;

var _util = require("./util");

var _marked = [filter, select, map].map(regeneratorRuntime.mark);

function matches(selector, element) {
  if (typeof selector === "function") return selector(element);
  return element.matches(selector);
}

function filter(selector, selection) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, e;

  return regeneratorRuntime.wrap(function filter$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;
          _iterator = selection[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 13;
            break;
          }

          e = _step.value;

          if (!matches(selector, e)) {
            _context.next = 10;
            break;
          }

          _context.next = 10;
          return e;

        case 10:
          _iteratorNormalCompletion = true;
          _context.next = 5;
          break;

        case 13:
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](3);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 19:
          _context.prev = 19;
          _context.prev = 20;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 22:
          _context.prev = 22;

          if (!_didIteratorError) {
            _context.next = 25;
            break;
          }

          throw _iteratorError;

        case 25:
          return _context.finish(22);

        case 26:
          return _context.finish(19);

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, _marked[0], this, [[3, 15, 19, 27], [20,, 22, 26]]);
}

function each(fn, selection) {
  var executedElements = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = filter(function (el) {
      return el !== null && executedElements.indexOf(el) === -1;
    }, selection)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var el = _step2.value;

      (0, _util.executeFunctionOrArrayOfFunctions)(fn, el);
      executedElements.push(el);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

function count(selection) {
  var uniqueElements = [];
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = filter(function (el) {
      return el !== null && uniqueElements.indexOf(el) === -1;
    }, selection)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var el = _step3.value;

      uniqueElements.push(el);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return uniqueElements.length;
}

function select(selector, selection) {
  var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, e, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, descendant;

  return regeneratorRuntime.wrap(function select$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context2.prev = 3;
          _iterator4 = selection[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context2.next = 46;
            break;
          }

          e = _step4.value;

          if (e) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("continue", 43);

        case 9:
          if (!matches(selector, e)) {
            _context2.next = 12;
            break;
          }

          _context2.next = 12;
          return e;

        case 12:
          if (!(typeof selector === "function")) {
            _context2.next = 42;
            break;
          }

          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context2.prev = 16;
          _iterator5 = e.querySelectorAll("*")[Symbol.iterator]();

        case 18:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context2.next = 26;
            break;
          }

          descendant = _step5.value;

          if (!selector(descendant)) {
            _context2.next = 23;
            break;
          }

          _context2.next = 23;
          return descendant;

        case 23:
          _iteratorNormalCompletion5 = true;
          _context2.next = 18;
          break;

        case 26:
          _context2.next = 32;
          break;

        case 28:
          _context2.prev = 28;
          _context2.t0 = _context2["catch"](16);
          _didIteratorError5 = true;
          _iteratorError5 = _context2.t0;

        case 32:
          _context2.prev = 32;
          _context2.prev = 33;

          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }

        case 35:
          _context2.prev = 35;

          if (!_didIteratorError5) {
            _context2.next = 38;
            break;
          }

          throw _iteratorError5;

        case 38:
          return _context2.finish(35);

        case 39:
          return _context2.finish(32);

        case 40:
          _context2.next = 43;
          break;

        case 42:
          return _context2.delegateYield(e.querySelectorAll(selector), "t1", 43);

        case 43:
          _iteratorNormalCompletion4 = true;
          _context2.next = 5;
          break;

        case 46:
          _context2.next = 52;
          break;

        case 48:
          _context2.prev = 48;
          _context2.t2 = _context2["catch"](3);
          _didIteratorError4 = true;
          _iteratorError4 = _context2.t2;

        case 52:
          _context2.prev = 52;
          _context2.prev = 53;

          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }

        case 55:
          _context2.prev = 55;

          if (!_didIteratorError4) {
            _context2.next = 58;
            break;
          }

          throw _iteratorError4;

        case 58:
          return _context2.finish(55);

        case 59:
          return _context2.finish(52);

        case 60:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked[1], this, [[3, 48, 52, 60], [16, 28, 32, 40], [33,, 35, 39], [53,, 55, 59]]);
}

function map(fn, selection) {
  var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, e, result;

  return regeneratorRuntime.wrap(function map$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context3.prev = 3;
          _iterator6 = selection[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context3.next = 19;
            break;
          }

          e = _step6.value;
          result = fn(e);

          if (result) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("continue", 16);

        case 10:
          if (result[Symbol.iterator]) {
            _context3.next = 15;
            break;
          }

          _context3.next = 13;
          return result;

        case 13:
          _context3.next = 16;
          break;

        case 15:
          return _context3.delegateYield(result, "t0", 16);

        case 16:
          _iteratorNormalCompletion6 = true;
          _context3.next = 5;
          break;

        case 19:
          _context3.next = 25;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t1 = _context3["catch"](3);
          _didIteratorError6 = true;
          _iteratorError6 = _context3.t1;

        case 25:
          _context3.prev = 25;
          _context3.prev = 26;

          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }

        case 28:
          _context3.prev = 28;

          if (!_didIteratorError6) {
            _context3.next = 31;
            break;
          }

          throw _iteratorError6;

        case 31:
          return _context3.finish(28);

        case 32:
          return _context3.finish(25);

        case 33:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked[2], this, [[3, 21, 25, 33], [26,, 28, 32]]);
}

function query(selection) {
  if (selection.querySelector) {
    selection = [selection];
  }

  var q = {};

  q.each = function (fn) {
    each(fn, selection);
  };

  // TODO: test
  q.count = function () {
    return count(selection);
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