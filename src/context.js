function getTokens(view, attributeName) {
  var tokens = view.getAttribute(attributeName);
  return tokens ? tokens.split(" ") : [];
}

function setTokens(view, attributeName, tokens) {
  tokens = tokens || [];
  view.setAttribute(attributeName, tokens.join(" "));
}

function addToken(element, attributeName, token) {
  var tokens = getTokens(element, attributeName);
  if (tokens.indexOf(token) > -1) return;
  tokens.push(token);
  setTokens(element, attributeName, tokens);
}

export default function context(name) {
  return function (element) {
    addToken(element, "data-jsua-context", name);
  };
}
