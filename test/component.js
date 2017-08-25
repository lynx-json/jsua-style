require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  component,
  slot
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
        <div data-jsua-style-slot-name="footer"></div>
      `;

      var innerHTML = `
      <div role="presentation" data-jsua-style-slot="content"></div>
      <div role="presentation" data-jsua-style-slot="footer"></div>
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
      element.lastElementChild.firstElementChild.getAttribute("data-jsua-style-slot-name").should.equal("footer");
    });
  });

  describe("when the element is reset", function () {
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
        <div id="one"></div>
        <div id="two" data-jsua-style-slot-name="header"></div>
      `;

      var innerHTML = `
      <div role="presentation" data-jsua-style-slot="header"></div>
      <div role="presentation" data-jsua-style-slot="content"></div>
      `;

      query(element).each([
        component("material-card", innerHTML)
      ]);

      element.jsuaStyleReset();
    });

    it("should remove presentation-specific structure", function () {
      element.firstElementChild.id.should.equal("one");
      element.lastElementChild.id.should.equal("two");
    });

    it("should remove the data-jsua-style-component attribute", function () {
      element.hasAttribute("data-jsua-style-component").should.be.false;
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
        slot("label", () => child)
      ]);
    });

    it("should add the element to the appropriate slot", function () {
      element.lastElementChild.firstElementChild.should.equal(child);
    });
  });

  describe("when a slot has mode 'replace'", function () {
    var child;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
        <div></div>
      `;

      child = element.lastElementChild;

      var innerHTML = `
      <div role="presentation" data-jsua-style-slot="content"></div>
      <div role="presentation" data-jsua-style-slot="label" data-jsua-style-slot-mode="replace"><div id="repaced"></div></div>
      `;

      query(element).each([
        component("material-card", innerHTML),
        slot("label", () => child)
      ]);
    });

    it("should clear the slot and then add the element to the appropriate slot", function () {
      element.lastElementChild.firstElementChild.should.equal(child);
    });
  });
});
