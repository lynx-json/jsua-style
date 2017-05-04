require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  selectors
} from "../src";

describe("when selecting firstChild elements", function () {
  describe("when an element has no parent", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      results = [];
      query(element).select(selectors.firstChild()).each(el => results.push(el));
    });
    it("should not select the element", function () {
      results.length.should.equal(0);
    });
  });

  describe("when no selector is specified", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
      <div></div>
      <div></div>
      `;

      results = [];
      query(element).select(selectors.firstChild()).each(el => results.push(el));
    });

    it("should select all elements that are the first child of their parents", function () {
      results.length.should.equal(1);
      results[0].should.equal(element.firstElementChild);
    });
  });

  describe("when a selector is specified", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
      <div></div>
      <div id="match"></div>
      `;

      results = [];
      query(element).select(selectors.firstChild("#match")).each(el => results.push(el));
    });

    it("should select all elements that are first among all siblings that match the selector", function () {
      results.length.should.equal(1);
      results[0].should.equal(element.lastElementChild);
    });
  });
});

describe("when selecting lastChild elements", function () {
  describe("when an element has no parent", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      results = [];
      query(element).select(selectors.lastChild()).each(el => results.push(el));
    });
    it("should not select the element", function () {
      results.length.should.equal(0);
    });
  });

  describe("when no selector is specified", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
      <div></div>
      <div></div>
      `;

      results = [];
      query(element).select(selectors.lastChild()).each(el => results.push(el));
    });

    it("should select all elements that are the last child of their parents", function () {
      results.length.should.equal(1);
      results[0].should.equal(element.lastElementChild);
    });
  });

  describe("when a selector is specified", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
      <div id="match"></div>
      <div></div>
      `;

      results = [];
      query(element).select(selectors.lastChild("#match")).each(el => results.push(el));
    });

    it("should select all elements that are last among all siblings that match the selector", function () {
      results.length.should.equal(1);
      results[0].should.equal(element.firstElementChild);
    });
  });
});

describe("when selecting nthChild elements", function () {
  describe("when an element has no parent", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      results = [];
      query(element).select(selectors.nthChild(0)).each(el => results.push(el));
    });
    it("should not select the element", function () {
      results.length.should.equal(0);
    });
  });

  describe("when no selector is specified", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
      <div></div>
      <div></div>
      `;

      results = [];
      query(element).select(selectors.nthChild(0)).each(el => results.push(el));
    });

    it("should select all elements that are at the specified index among their siblings", function () {
      results.length.should.equal(1);
      results[0].should.equal(element.firstElementChild);
    });
  });

  describe("when a selector is specified", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
      <div></div>
      <div id="match"></div>
      `;

      results = [];
      query(element).select(selectors.nthChild(0, "#match")).each(el => results.push(el));
    });

    it("should select all elements that are at the specified index among their siblings that match the selector", function () {
      results.length.should.equal(1);
      results[0].should.equal(element.lastElementChild);
    });
  });
});
