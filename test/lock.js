require("./html-document-api");
const chai = require("chai");
const should = chai.should();

import { query, lock } from "../src";

describe("when locking an element's style", function () {
  it("should add a data-jsua-style-locked attribute", function () {
    var el = document.createElement("div");
    query(el).each(lock());
    
    el.getAttribute("data-jsua-style-locked").should.equal("true");
  });
  
  it("should optionally identify the source of the lock", function () {
    var el = document.createElement("div");
    query(el).each(lock("app-header"));
    
    el.getAttribute("data-jsua-style-locked").should.equal("app-header");
  });
});
