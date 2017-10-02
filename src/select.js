import query from "./query";

export default function select(selector, fn) {
  return function (result) {
    if (result.view) {
      query(result.view).select(selector).each(fn);
    } else {
      query(result).select(selector).each(fn);
    }
  };
}
