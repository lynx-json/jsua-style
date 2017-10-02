import query from "./query";

export default function map(mapper, fn) {
  return function (result) {
    if (result.view) {
      // TODO: Test
      query(result.view).map(mapper).each(fn);
    } else {
      query(result).map(mapper).each(fn);
    }
  };
}
