import query from "./query";

export default function filter(filter, fn) {
  return function (el) {
    query(el).filter(filter).each(fn);
  };
}
