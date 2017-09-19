require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  selectors,
  mappers
} from "../src";

describe("when selecting `firstChild` elements", function () {
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

describe("when selecting `lastChild` elements", function () {
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

describe("when selecting `nthChild` elements", function () {
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

describe("when selecting the `first` element", function () {
  describe("when no selector is specified", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
      <div></div>
      <div></div>
      `;

      results = [];
      query(element).select(selectors.first()).each(el => results.push(el));
    });

    it("should select the first element of the previous selection", function () {
      results.length.should.equal(1);
      results[0].should.equal(element);
    });
  });

  describe("when a selector is specified", function () {
    var element, results;
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
      <div class="match"></div>
      <div class="match"></div>
      `;

      results = [];
      query(element).select(selectors.first(".match")).each(el => results.push(el));
    });

    it("should select the first element matching the selection", function () {
      results.length.should.equal(1);
      results[0].should.equal(element.firstElementChild);
    });
  });
});

describe("when selecting elements that do not match another selector", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.innerHTML = `
    <div class="match"></div>
    <div class="match"></div>
    `;

    results = [];
    query(element).select(selectors.not(".match")).each(el => results.push(el));
  });

  it("should select the first element matching the selection", function () {
    results.length.should.equal(1);
    results[0].should.equal(element);
  });
});

describe("when selecting elements with `has` mapped elements", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.innerHTML = `
    <div><div></div></div>
    <div></div>
    `;

    results = [];
    query(element).select(selectors.has(mappers.children("div"))).each(el => results.push(el));
  });

  it("should select all elements with one or more mapped elements matching the selection", function () {
    results.length.should.equal(2);
    results[0].should.equal(element);
    results[1].should.equal(element.firstElementChild);
  });

  describe("when selecting elements that have a specific number of mapped elements", function () {
    beforeEach(function () {
      element = document.createElement("div");
      element.innerHTML = `
      <div><div></div></div>
      <div></div>
      `;

      results = [];
      query(element).select(selectors.has(2, mappers.children("div"))).each(el => results.push(el));

    });

    it("should select all elements with one or more children matching the selection", function () {
      results.length.should.equal(1);
      results[0].should.equal(element);
    });
  });
});

describe("when selecting elements with `hasOne` mapped element", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.innerHTML = `
    <div><div></div></div>
    <div></div>
    `;

    results = [];
    query(element).select(selectors.hasOne(mappers.children("div"))).each(el => results.push(el));
  });

  it("should select all elements with a single child matching the selection", function () {
    results.length.should.equal(1);
    results[0].should.equal(element.firstElementChild);
  });
});
