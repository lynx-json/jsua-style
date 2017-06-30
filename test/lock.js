require("./html-document-api");
const chai = require("chai");
const should = chai.should();

import { query, lock } from "../src";

describe("when locking an element's style", function () {
  it("should add a data-jsua-style-locked attribute", function () {
    var el = document.createElement("div");
    query(el).each(lock([]));
    
    el.getAttribute("data-jsua-style-locked").should.equal("true");
  });
  
  it("should execute the functions if the element was not already locked", function () {
    var el = document.createElement("div");
    
    query(el).each(lock([
      el => el.selected = true
    ]));
    
    el.selected.should.be.true;
  });
  
  it("should not execute the functions if the element was already locked", function () {
    var el = document.createElement("div");
    el.setAttribute("data-jsua-style-locked", "true");
    
    query(el).each(lock([
      el => el.selected = true
    ]));
    
    (!!el.selected).should.be.false;
  });
});
