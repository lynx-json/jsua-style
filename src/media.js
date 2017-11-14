import query from "./query";
import { applyAdjustments } from "./util";

var mediaQueries;

function hasMediaContextChanged() {
  var change = false;

  for (let mq in mediaQueries) {
    let matches = window.matchMedia(mq).matches;
    if (mediaQueries[mq] !== matches) {
      mediaQueries[mq] = matches;
      change = true;
    }
  }

  return change;
}

function initialize() {
  mediaQueries = {};
  window.addEventListener("resize", function () {
    if (!hasMediaContextChanged()) return;

    var responsiveElements = Array.from(document.querySelectorAll("[data-jsua-style-responsive]"));

    responsiveElements.forEach(function applyResponsiveStyles(element) {
      for (let style of element.jsuaStyleResponsiveStyles) {
        if (window.matchMedia(style.mediaQuery).matches) {
          query(element).each(style.fn);
        }
      }
    });

    applyAdjustments();
  });
}

export default function media(mediaQuery, fn) {
  if (!mediaQueries) {
    initialize();
  }

  mediaQueries[mediaQuery] = window.matchMedia(mediaQuery).matches;

  return function (element) {
    element.jsuaStyleResponsiveStyles = element.jsuaStyleResponsiveStyles || [];
    element.jsuaStyleResponsiveStyles.push({
      mediaQuery: mediaQuery,
      fn: fn
    });
    element.setAttribute("data-jsua-style-responsive", true);

    if (window.matchMedia(mediaQuery).matches) {
      query(element).each(fn);
    }
  };
}
