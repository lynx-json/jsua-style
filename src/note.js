import {
  addToken
} from "./util";

export default function note(text) {
  return function (element) {
    addToken(element, "data-jsua-style-notes", text);
  };
}
