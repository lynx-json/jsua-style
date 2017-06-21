import query from "./query";

export default function slot(name, mapper) {
  return function (component) {
    query(component).map(mapper).each([
      el => el.setAttribute("data-jsua-style-slot-name", name),
      el => component.jsuaStyleAddToSlot(el)
    ]);
  };
}
