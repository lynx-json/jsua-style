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

You can convert a selection to an array:

```js

var element = document.createElement("div");
element.id = "one";

var a = query(element).toArray();

console.log(`a[0] "${a[0].id}"`);
// => Selected "one"

```

You can select from the query using CSS selectors or predicate selectors:

```js

var element = document.createElement("div");
element.id = "one";

query(element).select("#one").each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

query(element).select(el => el.id === "one").each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

```

You can filter the current selection using CSS selectors or predicate selectors:

```js

var element = document.createElement("div");
element.id = "one";

query(element).filter("#one").each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

query(element).filter(el => el.id === "one").each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

```

### Selectors

In addition to standard CSS selectors for `select` or `filter` operations, `jsua-style` includes the following predicate
selectors.

#### `firstChild`

Select all elements that are the first child matching the specified selector.

```js
var parent = document.createElement("div");

parent.innerHTML = `
<pre id="one"></pre>
<div id="two"></div>
<div id="three">
  <div id="four"></div>
</div>
`;

query(parent).select(firstChild("div")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "two"
// => Selected "four"

```

#### `lastChild`

Select all elements that are the last child matching the specified selector.

```js
var parent = document.createElement("div");

parent.innerHTML = `
<pre id="one"></pre>
<div id="two"></div>
<div id="three">
  <div id="four"></div>
</div>
<pre id="five"></pre>
`;

query(parent).select(lastChild("div")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "three"
// => Selected "four"

```

#### `nthChild`

Select all child elements at a specified index after filtering by the specified selector.

```js
var parent = document.createElement("div");

parent.innerHTML = `
<pre id="one"></pre>
<div id="two"></div>
<div id="three">
  <div id="four"></div>
</div>
<pre id="five"></pre>
`;

query(parent).select(nthChild(0, "div")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "two"
// => Selected "four"

```

> Note that `firstChild`, `lastChild`, and `nthChild` are similar to, but more flexible than, CSS selectors `:nth-of-type`, `:first-of-type`, and `:last-of-type`.

#### `first`

Select only the first element in a selection set.

```js
var parent = document.createElement("div");

parent.innerHTML = `
<pre id="one"></pre>
<div id="two"></div>
<div id="three">
  <div id="four"></div>
</div>
<pre id="five"></pre>
`;

query(parent).select(first("pre")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"

```

Styling
-------------------------------------------------

You can apply style to each item in a selection:

```js

var element = document.createElement("div");

query(element).each(el => el.style.backgroundColor = "red");

```

Mapping
-------------------------------------------------

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

### Mappers

The `map` function will take any element or iterable of elements. The `jsua-style`
module provides the following commonly used functions.

- `ancestors`: All ancestors of the specified element.

All mappers are used as follows:
  
```js
query(element).map(mappers.ancestors());
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

### Context

You can add information about visual context with the `context` function.

```js
query(element).each([
  context("page")
]);

// Now you can add style based on that context.
query(element).select("[data-jsua-context~=page] > [data-lynx-hints~=header]")
  .each(el => el.style.padding = "16px");
```

### Components

You can create a named component with slotted HTML structure.

```js
var element = document.createElement("div");
var initialHTML = `
<div data-jsua-style-slot-name="label">Label</div>
<div>Other Content</div>
`;

element.innerHTML = initialHTML;

var componentHTML = `
<div role="presentation" data-jsua-style-slot="label"></div>
<div role="presentation" data-jsua-style-slot="content"></div>
`
query(element).each([
  component("material-card", componentHTML)
]);

```

The component now has the following HTML.

```HTML
<div data-jsua-style-component="material-card">
  <div role="presentation" data-jsua-style-slot="label">
    <div data-jsua-style-slot-name="label">Label</div>
  </div>
  <div role="presentation" data-jsua-style-slot="content">
    <div>Other Content</div>
  </div>
</div>
```

> By default, children will be added to an element with the attribute
> `data-jsua-style-slot="content"`. If the child has a `data-jsua-style-slot-name`
> attribute, it will be added to an element with the same value for `data-jsua-style-slot`.

We could also have added an element to a specific slot after the component had
been created.

```js
query(childElement).each([
  component.slot("material-card", "label")
]);
```
