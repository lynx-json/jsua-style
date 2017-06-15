require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  mappers
} from "../src";

describe("when mapping next siblings", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div id="two"></div>
    <div id="three"></div>
    <div id="four"></div>
    <div id="five"></div>
    `;

    results = [];
    query(element).select("#three").map(mappers.nextSiblings()).each(el => results.push(el));
  });
  it("should select all later siblings from nearest to farthest", function () {
    results.length.should.equal(2);
    results[0].id.should.equal("four");
    results[1].id.should.equal("five");
  });
  
  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("*").map(mappers.nextSiblings("#five")).each(el => results.push(el));
    });
    
    it("should return the filtered results", function () {
      results[0].id.should.equal("five");
    });
  });
});

describe("when mapping previous siblings", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div id="two"></div>
    <div id="three"></div>
    <div id="four"></div>
    <div id="five"></div>
    `;

    results = [];
    query(element).select("#four").map(mappers.previousSiblings()).each(el => results.push(el));
  });
  it("should select all previous siblings from nearest to farthest", function () {
    results.length.should.equal(2);
    results[0].id.should.equal("three");
    results[1].id.should.equal("two");
  });
  
  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("*").map(mappers.previousSiblings("#two")).each(el => results.push(el));
    });
    
    it("should return the filtered results", function () {
      results[0].id.should.equal("two");
    });
  });
});

describe("when mapping ancestors", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div id="two">
      <div id="three"></div>
    </div>
    <div id="four">
      <div id="five"></div>
    </div>
    `;

    results = [];
    query(element).select("#three").map(mappers.ancestors()).each(el => results.push(el));
  });
  it("should select all ancestors from nearest to farthest", function () {
    results.length.should.equal(2);
    results[0].id.should.equal("two");
    results[1].id.should.equal("one");
  });
  
  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("*").map(mappers.ancestors("#two")).each(el => results.push(el));
    });
    
    it("should return the filtered results", function () {
      results[0].id.should.equal("two");
    });
  });
});

describe("when mapping real children", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div role="presentation">
      <div id="one"></div>
    </div>
    <div role="presentation">
      <div role="presentation">
        <div id="two"></div>
      </div>
    </div>
    `;

    results = [];
    query(element).select("*").map(mappers.realChildren()).each(el => results.push(el));
  });
  it("should select descendants separated from the element by only presentational elements", function () {
    results.length.should.equal(2);
    results[0].id.should.equal("one");
    results[1].id.should.equal("two");
  });
  
  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("*").map(mappers.realChildren("#two")).each(el => results.push(el));
    });
    
    it("should return the filtered results", function () {
      results[0].id.should.equal("two");
    });
  });
});

describe("when mapping the real parent", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div role="presentation">
      <div id="one"></div>
    </div>
    <div role="presentation">
      <div role="presentation">
        <div id="two"></div>
      </div>
    </div>
    `;

    results = [];
    query(element).select("#one").map(mappers.realParent()).each(el => results.push(el));
  });
  it("should select descendants separated from the element by only presentational elements", function () {
    results.length.should.equal(1);
    results[0].should.equal(element);
  });
  
  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("*").map(mappers.realParent("#other")).each(el => results.push(el));
    });
    
    it("should return the filtered results", function () {
      results.length.should.equal(0);
    });
  });
});
