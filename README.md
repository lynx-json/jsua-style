JSUA Style
=================================================

Querying
-------------------------------------------------

You can query an element or an array of elements:

```js

var element = document.createElement("div");
element.id = "one";

query(element).each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

var elementArray = [element];
query(elementArray).each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

```

You can select from the query using CSS selectors or predicate functions:

```js

var element = document.createElement("div");
element.id = "one";

query(element).select("#one").each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

query(element).select(el => el.id === "one").each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

```

You can filter the current selection using CSS selectors or predicate functions:

```js

var element = document.createElement("div");
element.id = "one";

query(element).filter("#one").each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

query(element).filter(el => el.id === "one").each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

```

You can map to one or more related elements:

```js

var parent = document.createElement("div");
parent.id = "parent";
parent.innerHTML = `
<div id="one"></div>
<div id="two"></div>
<div id="three"></div>
`;

query(parent).map(el => el.children).each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"
// => Selected "two"
// => Selected "three"

query(parent.firstElementChild).map(el => el.parent).each(el => console.log(`Selected "${el.id}"`));

// => Selected "parent"

```

Styling
-------------------------------------------------

You can apply style to each item in a selection:

```js

var element = document.createElement("div");

query(element).each(el => el.style.backgroundColor = "red");

```

Managing State
-------------------------------------------------

You can style an element in one or many states (using `on` to respond to events and `when` to apply styles only when the element is in a particular state):

```js
query(element).each([
  el => el.style.backgroundColor = "red",
  on("mouseover", setState("hover")),
  on("mouseout", clearState("hover")),
  when("normal", el => el.style.backgroundColor = "red"),
  when("hover", el => el.style.backgroundColor = "blue"),
  setState("normal")
]);
```
