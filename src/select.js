import query from "./query";

export default function select(selector, fn) {
  return function (el) {
    query(el).select(selector).each(fn, true);
  };
}
