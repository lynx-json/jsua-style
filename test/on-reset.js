require("./html-document-api");
const chai = require("chai");
const should = chai.should();

import { query, lock, on, onReset, map, mappers, context } from "../src";

describe("resetting an element's style", function () {
  var element;

  beforeEach(function () {
    var root = document.createElement("div");
    root.innerHTML = `
      <div></div>
    `;
    element = root.firstElementChild;
    element.style.color = "#ff0000";
    element.className = "a b";

    lock([
      map(mappers.wrapper(), el => el.id = "wrapper"),
      context("screen-size-small"),
      on("click", el => el.setAttribute("data-clicked", "true")),
      onReset([
        el => el.setAttribute("data-reset-applied", "true")
      ]),
      onReset([
        el => el.setAttribute("data-reset-applied-twice", "true")
      ])
    ])(element);

    element.jsuaStyleReset();
  });

  it("should remove all style attributes", function () {
    element.style.color.should.equal("");
  });
  it("should remove all CSS classes", function () {
    element.hasAttribute("class").should.be.false;
  });
  it("should remove the context attribute", function () {
    element.hasAttribute("data-jsua-context").should.be.false;
  });
  it("should unlock the element", function () {
    element.hasAttribute("data-jsua-style-locked").should.be.false;
  });
  it("should remove all event handlers setup with the 'on' function", function () {
    element.click();
    element.hasAttribute("data-clicked").should.be.false;
  });
  it("should remove presentation-specific wrappers", function () {
    element.parentElement.id.should.not.equal("wrapper");
  });
  it("should execute all functions passed to onReset", function () {
    element.hasAttribute("data-reset-applied").should.be.true;
    element.hasAttribute("data-reset-applied-twice").should.be.true;
  });
});
