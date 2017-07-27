require("./html-document-api");

const chai = require("chai");
const should = chai.should();
import { on, off } from "../src";

describe("when responding to events on an element", function () {
  it("should execute a function when the named event is raised", function () {
    var evt = { message: "Event" };
    var element = {
      addEventListener: (name, handler) => {
        handler(evt);
      }
    };

    on("click", (el, e) => {
      el.should.equal(element);
      e.should.equal(evt);
    })(element);
  });

  it("should execute an array of functions when the named event is raised", function () {
    var evt = { message: "Event" };
    var element = {
      addEventListener: (name, handler) => {
        handler(evt);
      }
    };

    on("click", [(el, e) => {
      el.should.equal(element);
      e.should.equal(evt);
    }])(element);
  });
});

describe("when no longer responding to events on an element", function () {
  it("should no longer execute a function when the named event is raised", function () {
    var element = document.createElement("div");

    var responded = false;

    on("click", (el, e) => {
      responded = true;
    })(element);

    on("click", (el, e) => {
      responded = true;
    })(element);

    off("click")(element);

    element.click();

    responded.should.be.false;
  });
});
