require("./html-document-api");
const chai = require("chai");
const should = chai.should();

import { query, map, mappers } from "../src";

describe("when mapping to a related element", function () {
  var element;
  
  beforeEach(function () {
    element = document.createElement("div");
    element.innerHTML = `
      <div data-jsua-style-locked="true"></div>
    `;
    
    query(element)
      .each([
        map(mappers.children(), [
          el => el.selected = true
        ])
      ]);
  });
  
  it("should apply styles to the mapped element", function () {
    element.firstElementChild.selected.should.be.true;
  });
  
  it("should apply styles even to locked elements", function () {
    element.firstElementChild.selected.should.be.true;
  });
});
