import query from "./query";

export default function filter(filter, fn) {
  return function (result) {
    if (result.view) {
      // TODO: Test
      query(result.view).filter(filter).each(fn);
    } else {
      query(result).filter(filter).each(fn);
    }
  };
}
