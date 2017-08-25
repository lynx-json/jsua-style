import query from "./query";
import onReset from "./on-reset";

export default function lock(fn) {
  return function (el) {
    if (el.hasAttribute("data-jsua-style-locked")) return;

    query(el).each([
      fn,
      onReset(el => el.removeAttribute("data-jsua-style-locked")),
      el => el.setAttribute("data-jsua-style-locked", "true")
    ]);
  };
}
