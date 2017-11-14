import query from "./query";
import { applyAdjustments } from "./util";
var timer;

function applyAdjustmentsOnDelay() {
  if (timer) window.clearTimeout(timer);

  timer = window.setTimeout(function () {
    applyAdjustments();
    timer = null;
  }, 10);
}

export default function adjust(fn) {
  return function (element) {
    element.setAttribute("data-jsua-style-adjust", true);
    element.addEventListener("jsua-style-adjust", function () {
      query(element).each(fn);
    });

    applyAdjustmentsOnDelay();
  };
}
