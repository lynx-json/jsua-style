import query from "./query";

export default function adjust(fn) {
  return function (element) {
    element.setAttribute("data-jsua-style-adjust", true);
    element.addEventListener("jsua-style-adjust", function () {
      query(element).each(fn);
    });
  };
}
