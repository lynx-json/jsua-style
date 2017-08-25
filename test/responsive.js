require("./html-document-api");
const chai = require("chai");
const should = chai.should();

import { query, responsive } from "../src";

describe("when identifying responsive elements", function () {
  it("should mark the element as responsive to media context change", function () {
    var element = document.createElement("div");
    query(element).each(responsive());
    element.hasAttribute("data-jsua-style-responsive").should.be.true;
  });
});
