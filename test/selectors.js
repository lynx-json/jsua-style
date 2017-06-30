require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  selectors
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

describe("when selecting elements with `hasChildren`", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.innerHTML = `
    <div><div></div></div>
    <div></div>
    `;

    results = [];
    query(element).select(selectors.hasChildren("div")).each(el => results.push(el));
  });

  it("should select all elements with one or more children matching the selection", function () {
    results.length.should.equal(2);
    results[0].should.equal(element);
    results[1].should.equal(element.firstElementChild);
  });
});

describe("when selecting elements with `hasOneChild`", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.innerHTML = `
    <div><div></div></div>
    <div></div>
    `;

    results = [];
    query(element).select(selectors.hasOneChild("div")).each(el => results.push(el));
  });

  it("should select all elements with a single child matching the selection", function () {
    results.length.should.equal(1);
    results[0].should.equal(element.firstElementChild);
  });
});

describe("when selecting elements with `hasRealChildren`", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.innerHTML = `
    <div><div role="presentation"></div></div>
    <div><div role="presentation"><div></div></div></div>
    `;

    results = [];
    query(element).select(selectors.hasRealChildren("div")).each(el => results.push(el));
  });

  it("should select all elements with one or more children matching the selection", function () {
    results.length.should.equal(3);
    results[0].should.equal(element);
    results[1].should.equal(element.lastElementChild);
    results[2].should.equal(element.lastElementChild.firstElementChild);
  });
});

describe("when selecting elements with `hasOneRealChild`", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.innerHTML = `
    <div><div role="presentation"><div></div></div></div>
    <div></div>
    `;

    results = [];
    query(element).select(selectors.hasOneRealChild("div")).each(el => results.push(el));
  });

  it("should select all elements with a single child matching the selection", function () {
    results.length.should.equal(2);
    results[0].should.equal(element.firstElementChild);
    results[1].should.equal(element.firstElementChild.firstElementChild);
  });
});

describe("when selecting elements with `hasParent`", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "root";
    
    element.innerHTML = `
    <div><div></div></div>
    <div><div></div></div>
    `;

    results = [];
    query(element).select(selectors.hasParent("#root")).each(el => results.push(el));
  });

  it("should select all elements with a parent matching the selection", function () {
    results.length.should.equal(2);
    results[0].should.equal(element.firstElementChild);
    results[1].should.equal(element.lastElementChild);
  });
});

describe("when selecting elements with `hasRealParent`", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "root";
    
    element.innerHTML = `
    <div id="one"><div role="presentation" id="two"></div></div>
    <div id="three"><div role="presentation" id="four"><div id="five"></div></div></div>
    <div role="presentation" id="six"><div id="seven"></div></div>
    `;

    results = [];
    query(element).select(selectors.hasRealParent("#root")).each(el => results.push(el));
  });

  it("should select all elements with a real parent matching the selection", function () {
    results.length.should.equal(4);
    results[0].should.equal(element.firstElementChild);
    results[1].should.equal(element.children[1]);
    results[2].should.equal(element.lastElementChild);
    results[3].should.equal(element.lastElementChild.firstElementChild);
  });
});
