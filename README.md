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

In most cases, rather than chaining a `filter` function to a query, it makes sense to do
a simple `filter` operation (or many consecutive `filter` operations) while maintaining the original 
context. This can be done with the standalone `filter` function.

```js

var parent = document.createElement("div");
parent.id = "parent";
parent.innerHTML = `
<div id="one"></div>
<div id="two"></div>
<div id="three"></div>
`;

query(parent).map(mappers.children()).each([
  filter("#one", el => console.log(`Selected "${el.id}"`)),
  filter("#two", el => console.log(`Selected "${el.id}"`)),
  filter("#three", el => console.log(`Selected "${el.id}"`))
]);

// => Selected "one"
// => Selected "two"
// => Selected "three"

query(parent.firstElementChild).map(el => el.parent).each(el => console.log(`Selected "${el.id}"`));

// => Selected "parent"

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

#### `has`

Select only elements that map to a set of related elements.

```js
var parent = document.createElement("div");
parent.id = "parent";

parent.innerHTML = `
<pre id="one"></pre>
<div id="two">
  <pre></pre>
</div>
<div id="three">
  <div></div>
  <div></div>
</div>
<pre id="four"></pre>
`;

query(parent).select(has(mappers.children("div"))).each(el => console.log(`Selected "${el.id}"`));

// => Selected "parent"
// => Selected "three"

```

#### `hasOne`

Select only elements that map to a single related element.

```js
var parent = document.createElement("div");
parent.id = "parent";

parent.innerHTML = `
<pre id="one"></pre>
<div id="two">
  <pre></pre>
</div>
<div id="three">
  <div></div>
</div>
<pre id="four"></pre>
`;

query(parent).select(hasOne(mappers.children("div"))).each(el => console.log(`Selected "${el.id}"`));

// => Selected "three"

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

In most cases, rather than chaining a `map` function to a query, it makes sense to do
a simple `map` operation (or many consecutive `map` operations) while maintaining the original 
context. This can be done with the standalone `map` function.

```js

var parent = document.createElement("div");
parent.id = "parent";
parent.innerHTML = `
<div id="one"></div>
<div id="two"></div>
<div id="three"></div>
`;

query(parent).each([
  map("#one", el => console.log(`Selected "${el.id}"`)),
  map("#two", el => console.log(`Selected "${el.id}"`)),
  map("#three", el => console.log(`Selected "${el.id}"`))
]);

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

#### children

```js
var parent = document.createElement("div");
parent.id = "parent";
parent.innerHTML = `
<div id="one"></div>
<div id="two"></div>
<div id="three"></div>
`;

query(parent).map(mappers.children()).each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"
// => Selected "two"
// => Selected "three"

// Include an inline filter
query(parent).map(mappers.children("#two")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "two"
```

#### realChildren

```js
var parent = document.createElement("div");
parent.id = "parent";
parent.innerHTML = `
<div role="presentation">
  <div id="one"></div>
</div>
<div role="presentation">
  <div role="presentation">
    <div id="two"></div>
  </div>
</div>
<div id="three"></div>
`;

query(parent).map(mappers.realChildren()).each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"
// => Selected "two"
// => Selected "three"

// Include a filter parameter
query(parent).map(mappers.realChildren("#two")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "two"
```

#### parent

```js
var parent = document.createElement("div");
parent.id = "parent";
parent.innerHTML = `
<div id="one"></div>
<div id="two"></div>
<div id="three"></div>
`;

query(parent).select("#two").map(mappers.parent()).each(el => console.log(`Selected "${el.id}"`));

// => Selected "parent"

// Include a filter parameter
query(parent).select("#two").map(mappers.parent("#parent")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "parent"
```

#### realParent

```js
var parent = document.createElement("div");
parent.id = "parent";
parent.innerHTML = `
<div role="presentation">
  <div id="one"></div>
</div>
<div role="presentation">
  <div role="presentation">
    <div id="two"></div>
  </div>
</div>
<div id="three"></div>
`;

query(parent).select("#two").map(mappers.realParent()).each(el => console.log(`Selected "${el.id}"`));

// => Selected "parent"

// Include a filter parameter
query(parent).select("#two").map(mappers.realParent("#parent")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "parent"
```

#### ancestors

```js
var parent = document.createElement("div");
parent.id = "root";
parent.innerHTML = `
<div id="one">
  <div id="two"></div>
</div>
`;

query(parent).select("#two").map(mappers.ancestors()).each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"
// => Selected "root"

// Include an inline filter
query(parent).select("#two").map(mappers.ancestors("#root")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "root"
```

#### descendants

```js
var parent = document.createElement("div");
parent.id = "root";
parent.innerHTML = `
<div id="one">
  <div id="two"></div>
</div>
`;

query(parent).map(mappers.descendants()).each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"
// => Selected "two"

// Include an inline filter
query(parent).map(mappers.descendants("#one")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "one"
```

#### previousSiblings and nextSiblings

```js
var parent = document.createElement("div");
parent.id = "root";
parent.innerHTML = `
<div id="one"></div>
<div id="two"></div>
<div id="three"></div>
<div id="four"></div>
`;

query(parent).select("#three").map(mappers.previousSiblings()).each(el => console.log(`Selected "${el.id}"`));

// => Selected "two"
// => Selected "one"

// Include a filter parameter
query(parent).select("#two").map(mappers.nextSiblings("#four")).each(el => console.log(`Selected "${el.id}"`));

// => Selected "four"
```

#### slot

You can map to a component's named slot (see "Components" below).

```js
query(component).each([
  map(mappers.slot("header"), [
    el => el.style.borderBottom = "1px solid #cccccc"
  ])
]);
```

In the case where an element uses more than one component, you can pass the
name of the component as a second parameter.

```js
query(component).each([
  map(mappers.slot("header", "material-card"), [
    el => el.style.borderBottom = "1px solid #cccccc"
  ])
]);
```

#### wrapper

You can wrap an element and return the wrapper.

```js
query(el).each([
  map(mappers.wrapper(), [
    el => el.style.padding = "20px"
  ])
]);
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

> You can stop responding to an event by calling `off(eventName)` (for example, `off("mouseover")`).

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
var mapHeader = mappers.realChildren("[data-lynx-hints~=header]");
query(component).each([
  slot("header", mapHeader)
]);
```

For more on [Authoring Components](https://github.com/lynx-json/jsua-style/wiki/authoring-components) visit the [wiki](https://github.com/lynx-json/jsua-style/wiki).
