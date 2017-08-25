import query from "./query";
import * as filters from "./selectors";
var jsua = require("@lynx-json/jsua");

const registry = {};
var initialized = false;

function initialize() {
  if (!window) return;
  initialized = true;

  window.addEventListener("resize", function () {
    var change = false;

    for (var b in registry) {
      let matches = window.matchMedia(b).matches;
      if (registry[b] !== matches) {
        registry[b] = matches;
        change = true;
      }
    }

    if (change) {
      query(document.body)
        .select("[data-content-type]:not([role=presentation]), [data-content-type] *:not([role=presentation])")
        .each([
          el => {
            if (el.jsuaStyleReset) {
              el.jsuaStyleReset();
              delete el.jsuaStyleReset;
            }
          }
        ]);

      var root = document.querySelector("[data-content-type]");

      jsua.finishing.finish({
        view: root,
        content: {}
      });
    }
  });
}

export default function registerBreakpoints(breakpoints) {
  for (var b of breakpoints) {
    var match = window.matchMedia(b).matches;
    registry[b] = match;
  }

  if (!initialized) {
    initialize();
  }
}
