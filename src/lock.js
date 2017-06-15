export default function lock(source) {
  source = source || "true";
  return function (element) {
    element.setAttribute("data-jsua-style-locked", source);
  };
}
