require("./html-document-api");
const chai = require("chai");
const should = chai.should();

import { query, map, mappers, filter } from "../src";

describe("when applying style to a filtered selection", function () {
  var element;
  
  beforeEach(function () {
    element = document.createElement("div");
    element.innerHTML = `
      <div id="one"></div>
      <div id="two"></div>
    `;
    
    query(element)
      .each([
        map(mappers.children(), [
          filter("#one", [
            el => el.selected = true
          ])
        ])
      ]);
  });
  
  it("should apply styles only to the filtered elements", function () {
    element.firstElementChild.selected.should.be.true;
    should.not.exist(element.lastElementChild.selected);
  });
});
