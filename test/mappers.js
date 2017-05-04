require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  mappers
} from "../src";

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
});

// describe("when mapping siblings", function () {
//   var element, results;
//   beforeEach(function () {
//     element = document.createElement("div");
//     element.id = "one";
// 
//     element.innerHTML = `
//     <div id="two">
//       <div id="three"></div>
//     </div>
//     <div id="four">
//       <div id="five"></div>
//     </div>
//     <div id="six">
//       <div id="seven"></div>
//     </div>
//     `;
// 
//     results = [];
//     query(element).select("#four").map(mappers.siblings()).each(el => results.push(el));
//   });
//   it("should select all siblings from first to last", function () {
//     results.length.should.equal(2);
//     results[0].id.should.equal("two");
//     results[1].id.should.equal("six");
//   });
// });
