require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  component
} from "../src";

describe("when creating a component", function () {
  var element;
  beforeEach(function () {
    element = document.createElement("div");
  });

  it("should add the name to the list of component tokens", function () {
    query(element).each([
      component("material-card")
    ]);

    element.getAttribute("data-jsua-style-component").should.equal("material-card");
  });

  describe("when innerHTML is provided", function () {
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
        <div id="childWithNoSpecifiedSlot"></div>
        <div data-jsua-style-slot-name="label"></div>
      `;

      var innerHTML = `
      <div role="presentation" data-jsua-style-slot="content"></div>
      <div role="presentation" data-jsua-style-slot="label"></div>
      `;

      query(element).each([
        component("material-card", innerHTML)
      ]);
    });

    it("should add the HTML to the element", function () {
      element.firstElementChild.getAttribute("role").should.equal("presentation");
    });

    it("should, by default, add children to a slot named 'content'", function () {
      element.firstElementChild.firstElementChild.id.should.equal("childWithNoSpecifiedSlot");
    });

    it("should add children with a slot name to the appropriate slot", function () {
      element.lastElementChild.firstElementChild.getAttribute("data-jsua-style-slot-name").should.equal("label");
    });
  });

  describe("when an element is slotted after the component is created", function () {
    var child;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
        <div></div>
      `;

      child = element.lastElementChild;

      var innerHTML = `
      <div role="presentation" data-jsua-style-slot="content"></div>
      <div role="presentation" data-jsua-style-slot="label"></div>
      `;

      query(element).each([
        component("material-card", innerHTML),
        el => query(child).each([
          component.slot("material-card", "label")
        ])
      ]);
    });

    it("should add the element to the appropriate slot", function () {
      element.lastElementChild.firstElementChild.should.equal(child);
    });
  });
});
