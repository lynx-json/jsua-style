require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  mappers
} from "../src";

describe("when querying", function () {
  it("should query an element", function () {
    var element = document.createElement("div");
    query(element).each(el => el.selected = true);
    element.selected.should.equal(true);
  });

  it("should query an iterable of elements", function () {
    var element = document.createElement("div");
    query([element]).each(el => el.selected = true);
    element.selected.should.equal(true);
  });

  describe("and selecting elements based on a predicate", function () {
    it("should select the element itself if the element matches the selector", function () {
      var element = document.createElement("div");
      query([element]).select(el => true).each(el => el.selected = true);
      element.selected.should.equal(true);
    });

    it("should select the element's descendants if they match the selector", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
      `;
      var count = 0;
      query([element]).select(el => true).each(el => count += 1);
      count.should.equal(4);
    });

    it("should not select elements that do not match the selector", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
      `;
      var count = 0;
      query([element]).select(el => false).each(el => count += 1);
      count.should.equal(0);
    });

    it("should not iterate until execution", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
      `;

      var count = 0;
      var q = query([element]).select(function (el) {
        count += 1;
        return true;
      });

      count.should.equal(0);
      q.each(el => el);
      count.should.equal(4);
    });
  });

  describe("and selecting elements based on a CSS selector", function () {
    it("should select the element itself if the element matches the selector", function () {
      var selector = "*";
      var element = document.createElement("div");
      query([element]).select(selector).each(el => el.selected = true);
      element.selected.should.equal(true);
    });

    it("should select all descendants matching the selector", function () {
      var selector = "*";
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
      `;

      var count = 0;
      query([element]).select(selector).each(el => count += 1);
      count.should.equal(4);
    });

    it("should not select elements that do not match the selector", function () {
      var selector = "pre";
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
      `;
      var count = 0;
      query([element]).select(selector).each(el => count += 1);
      count.should.equal(0);
    });

    it("should not iterate until execution", function () {
      var selector = "*";
      var count = 0;
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
      `;

      var q = query([element]).select(selector);

      count.should.equal(0);
      q.each(el => count += 1);
      count.should.equal(4);
    });
  });

  describe("and mapping to a new selection", function () {
    it("should support one-to-one mapping", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
      `;

      query(element.firstElementChild).map(el => el.parentElement).each(el => el.isSelected = true);
      element.isSelected.should.equal(true);
    });

    it("should support one-to-many mapping", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
        <div></div>
      `;

      query(element).map(el => el.children).each(el => el.selected = true);
      element.children[0].selected.should.equal(true);
      element.children[1].selected.should.equal(true);
      (!!element.selected).should.equal(false);
    });

    it("should support chaining mappers", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div><div></div></div>
        <div><div></div></div>
      `;

      query(element).map(el => el.children).map(el => el.children).each(el => el.selected = true);
      element.children[0].children[0].selected.should.equal(true);
      element.children[1].children[0].selected.should.equal(true);
      (!!element.selected).should.equal(false);
    });

    it("should support selecting from a mapped selection", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div><div></div></div>
        <div><div></div></div>
      `;

      query(element).map(mappers.realChildren()).select("div").each(el => el.selected = true);
      element.children[0].selected.should.equal(true);
      element.children[1].selected.should.equal(true);
      element.children[0].children[0].selected.should.equal(true);
      element.children[1].children[0].selected.should.equal(true);
      (!!element.selected).should.equal(false);
    });
  });

  describe("and iterating over each selected element", function () {
    it("should execute a function for each selected element", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
      `;

      query([element]).select(el => true).each(el => el.modified = true);
      element.modified.should.equal(true);
      element.firstElementChild.modified.should.equal(true);
    });

    it("should execute a function or an array of functions", function () {
      var element = document.createElement("div");

      query([element]).select(el => true).each([
        el => el.modified = true,
        el => el.modifiedAgain = true
      ]);
      element.modified.should.equal(true);
      element.modifiedAgain.should.equal(true);
    });

    it("should not execute a function on the same element twice", function () {
      var element = document.createElement("div");

      query([element]).map(el => [element, element]).each(function (el) {
        element.count = element.count || 0;
        element.count += 1;
      });
      element.count.should.equal(1);
    });

    it("should ignore null selections", function () {
      var element = document.createElement("div");

      var count = 0;
      query([element]).map(el => null).each(function (el) {
        count += 1;
      });
      count.should.equal(0);
    });

    it("should support chaining", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div><div></div></div>
        <div><div></div></div>
      `;

      query(element).map(el => el.children).each(el => el.selected = false).each(el => el.selected = true);
      element.children[0].selected.should.equal(true);
      element.children[1].selected.should.equal(true);
      (!!element.selected).should.equal(false);
    });
    
    it("should not act on locked elements, by default", function () {
      var results = [];
      var element = document.createElement("div");
      element.innerHTML = `
        <div data-jsua-style-locked="true"><div></div></div>
        <div><div data-jsua-style-locked="true"></div></div>
      `;

      query(element).select("*").each(el => results.push(el));
      results[0].should.equal(element);
      results[1].should.equal(element.children[0].children[0]);
      results[2].should.equal(element.children[1]);
      results.length.should.equal(3);
    });
    
    it("should act on locked elements if specified", function () {
      var results = [];
      var element = document.createElement("div");
      element.innerHTML = `
        <div data-jsua-style-locked="true"><div></div></div>
        <div><div data-jsua-style-locked="true"></div></div>
      `;

      var actOnLockedElements = true;
      query(element).select("*").each(el => results.push(el), actOnLockedElements);
      results.length.should.equal(5);
    });
  });

  describe("and converting a selection to an array", function () {
    it("should execute a function for each selected element", function () {
      var element = document.createElement("div");
      element.innerHTML = `
        <div></div>
      `;

      var a = query([element]).select(el => true).toArray();
      a[0].should.equal(element);
      a[1].should.equal(element.firstElementChild);
    });
  });

  describe("and filtering", function () {
    describe("by predicate", function () {
      it("should select only elements matching the predicate", function () {
        var matchingElement = document.createElement("div");
        matchingElement.isMatch = true;
        var nonMatchingElement = document.createElement("div");

        query([matchingElement, nonMatchingElement]).filter(el => el.isMatch).each(el => el.selected = true);
        matchingElement.selected.should.equal(true);
        should.not.exist(nonMatchingElement.selected);
      });
    });

    describe("by CSS selector", function () {
      it("should select only elements matching the CSS selector", function () {
        var element = document.createElement("div");
        element.innerHTML = `
          <div></div>
          <pre></pre>
        `;

        query(element).select("div").filter("div").each(el => el.modified = true);
        element.firstElementChild.modified.should.equal(true);
        should.not.exist(element.lastElementChild.modified);
      });
    });
  });
});
