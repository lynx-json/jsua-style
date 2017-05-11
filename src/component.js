// import {
//   raiseEvent
// } from "./util";
// 

import query from "./query";
import {
  first
} from "./selectors";
import {
  ancestors
} from "./mappers";

import {
  addToken
} from "./util";

export default function component(name, innerHTML) {
  return function (element) {
    var slots = {};

    function addToSlot(el) {
      var slotName = el.getAttribute("data-jsua-style-slot-name") || "content";

      if (slots[slotName]) {
        slots[slotName].appendChild(el);
      }
    }

    if (innerHTML) {
      var componentTemplate = document.createElement("div");
      componentTemplate.innerHTML = innerHTML;

      query(componentTemplate)
        .select("[data-jsua-style-slot]")
        .each(slot => slots[slot.getAttribute("data-jsua-style-slot")] = slot);

      var children = [];
      query(element).map(el => el.children).each(function (child) {
        children.push(child);
      });

      query(children).each(el => addToSlot(el));

      while (componentTemplate.firstChild) {
        element.appendChild(componentTemplate.firstChild);
      }
    }

    element.addEventListener("jsua-style-slotted", function (evt) {
      if (evt.componentName !== name) return;
      addToSlot(evt.element);
    });

    addToken(element, "data-jsua-style-component", name);
  };
}

component.slot = function (componentName, slotName) {
  return function (element) {
    query(element)
      .map(ancestors())
      .filter(first("[data-jsua-style-component]"))
      .each(function (component) {
        var evt = document.createEvent("Event");
        evt.componentName = componentName;
        evt.element = element;
        element.setAttribute("data-jsua-style-slot-name", slotName);
        evt.initEvent("jsua-style-slotted", false, false);
        component.dispatchEvent(evt);
      });
  };
};