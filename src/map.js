import query from "./query";

export default function map(mapper, fn) {
  return function (el) {
    query(el).map(mapper).each(fn);
  };
}
