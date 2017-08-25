import query from "./query";
import {
  first
} from "./selectors";
import {
  ancestors
} from "./mappers";
import onReset from "./on-reset";
import {
  addToken
} from "./util";

export default function component(name, innerHTML) {
  return function (element) {
    var slots = {};

    var existingGetSlotFn = element.jsuaStyleGetSlot;

    element.jsuaStyleGetSlot = function (slotName, componentName) {
      if (!componentName && slots[slotName]) return slots[slotName];

      if (componentName === name) {
        return slots[slotName];
      }

      if (existingGetSlotFn) return existingGetSlotFn(slotName, componentName);
    };

    function addToSlot(el) {
      var slotName = el.getAttribute("data-jsua-style-slot-name") || "content";

      if (slots[slotName]) {
        var slot = slots[slotName];
        if (slot.getAttribute("data-jsua-style-slot-mode") === "replace") {
          while (slot.firstChild) {
            slot.removeChild(slot.firstChild);
          }
        }

        slot.appendChild(el);
      }
    }

    element.jsuaStyleAddToSlot = addToSlot;

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

      query(element).each(onReset([
        function clearComponentStructure(el) {
          while (el.firstElementChild) {
            el.removeChild(el.firstElementChild);
          }

          children.forEach(child => el.appendChild(child));
        },
        el => el.removeAttribute("data-jsua-style-component")
      ]));

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

// TODO: Remove this and all references. Deprecated in favor of the slot function.
component.slot = function (componentName, slotName) {
  return function (element) {
    element.setAttribute("data-jsua-style-slot-name", slotName);

    query(element)
      .map(ancestors())
      .filter(first("[data-jsua-style-component]"))
      .each(function (component) {
        var evt = document.createEvent("Event");
        evt.componentName = componentName;
        evt.element = element;
        evt.initEvent("jsua-style-slotted", false, false);
        component.dispatchEvent(evt);
      });
  };
};
