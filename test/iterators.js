require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  mappers
} from "../src";

var Iterable = require("../src/iterable");
import { createSelectIterator, createMapperIterator } from "../src/iterators";

describe("when mapping", function () {
  it("should map from one element to another", function () {
    var expectedResult = document.createElement("div");
    var selection = new Iterable([document.createElement("div")]);
    var mapperIterator = createMapperIterator(el => expectedResult, selection);
    mapperIterator.next().value.should.equal(expectedResult);
  });

  it("should map from one element to many", function () {
    var expectedResults = [document.createElement("div"), document.createElement("div")];
    var selection = new Iterable([document.createElement("div")]);
    var mapperIterator = createMapperIterator(el => expectedResults, selection);
    mapperIterator.next().value.should.equal(expectedResults[0]);
    mapperIterator.next().value.should.equal(expectedResults[1]);
  });

  it("should map from many to many", function () {
    var element = document.createElement("div");
    element.id = "root";

    element.innerHTML = `
    <div id="child-one">
      <div id="one-a"></div>
      <div id="one-b"></div>
    </div>
    <div id="child-two">
      <div id="two-a"></div>
      <div id="two-b"></div>
    </div>
    <div id="child-three">
    </div>
    `;

    var selection = new Iterable(() => createSelectIterator("*", [element]));

    var mapperIterator = createMapperIterator(mappers.ancestors(), selection);

    // var result = new Iterable(() => createMapperIterator(mappers.ancestors(), selection));
    // mapperIterator.next().value.id.should.equal("one-a");
    mapperIterator.next().done.should.equal(false);
  });
});

describe("when selecting", function () {
  it("should select from the previous selection", function () {
    var element = document.createElement("div");
    element.id = "root";

    element.innerHTML = `
    <div id="child-one">
      <div id="one-a"></div>
      <div id="one-b"></div>
    </div>
    <div id="child-two">
      <div id="two-a"></div>
      <div id="two-b"></div>
    </div>
    `;

    var selection = [element.children[0], element.children[1]];

    var mapperIterator = createSelectIterator("*", selection);
    mapperIterator.next().value.id.should.equal("child-one");
    mapperIterator.next().value.id.should.equal("one-a");
    mapperIterator.next().value.id.should.equal("one-b");
    mapperIterator.next().value.id.should.equal("child-two");
    mapperIterator.next().value.id.should.equal("two-a");
    mapperIterator.next().value.id.should.equal("two-b");
  });
});
