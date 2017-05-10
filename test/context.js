require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  context,
  query
} from "../src";

describe("when setting context", function () {
  var element;
  beforeEach(function () {
    element = document.createElement("div");
  });

  it("should add the name to the list of context tokens", function () {
    query(element).each(context("page"));
    var tokens = element.getAttribute("data-jsua-context");
    tokens.should.equal("page");
  });

  it("should delimit multiple tokens with spaces", function () {
    query(element).each([
      context("page"),
      context("large-screen")
    ]);
    var tokens = element.getAttribute("data-jsua-context");
    tokens.should.equal("page large-screen");
  });

  it("should not add a context name more than once", function () {
    query(element).each([
      context("page"),
      context("page"),
      context("large-screen")
    ]);
    var tokens = element.getAttribute("data-jsua-context");
    tokens.should.equal("page large-screen");
  });
});
