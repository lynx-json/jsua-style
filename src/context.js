import {
  addToken
} from "./util";

export default function context(name) {
  return function (element) {
    addToken(element, "data-jsua-context", name);
  };
}
