require("./html-document-api");
const chai = require("chai");
const should = chai.should();

import { query, map, mappers, select } from "../src";

describe("when applying style to a selection", function () {
  var element;

  beforeEach(function () {
    element = document.createElement("div");
    element.className = "selected";
    element.innerHTML = `
      <div id="one" class="selected"></div>
      <div id="two"></div>
    `;

    query(element)
      .each([
        select(".selected", [
          el => el.selected = true
        ])
      ]);
  });

  it("should apply styles only to the selected elements", function () {
    element.selected.should.be.true;
    element.firstElementChild.selected.should.be.true;
    should.not.exist(element.lastElementChild.selected);
  });

  describe("when selecting from a jsua finishing result", function () {
    beforeEach(function () {
      element = document.createElement("div");
      element.className = "selected";
      element.innerHTML = `
        <div id="one" class="selected"></div>
        <div id="two"></div>
      `;

      var result = { view: element };
      select(".selected", [
        el => el.selected = true
      ])(result);
    });

    it("should apply styles only to the selected elements", function () {
      element.selected.should.be.true;
      element.firstElementChild.selected.should.be.true;
      should.not.exist(element.lastElementChild.selected);
    });
  })
});
