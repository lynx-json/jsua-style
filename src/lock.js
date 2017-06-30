import query from "./query";

export default function lock(fn) {
  return function (el) {
    if (el.hasAttribute("data-jsua-style-locked")) return;
    
    query(el).each([
      fn,
      el => el.setAttribute("data-jsua-style-locked", "true")
    ]);
  };
}
