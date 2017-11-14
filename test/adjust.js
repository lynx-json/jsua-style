require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import { adjust, query, media } from "../src";
const sinon = require("sinon");

function resize() {
  var evt = document.createEvent("Event");
  evt.initEvent("resize", false, false);

  window.dispatchEvent(evt);
}

describe("when styling adjustments", function () {
  var element;

  beforeEach(function () {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  afterEach(function () {
    document.body.removeChild(element);
  });

  describe("when finishing is complete", function () {
    var count = 0;

    beforeEach(function () {
      var child = document.createElement("div");
      element.appendChild(child);

      adjust(el => el.setAttribute("adjusted", ++count))(element);
      adjust(el => el.setAttribute("adjusted", ++count))(child);
    });

    it("should apply adjustments in reverse document order", function (done) {
      window.setTimeout(function () {
        element.getAttribute("adjusted").should.equal("2");
        element.firstElementChild.getAttribute("adjusted").should.equal("1");
        done();
      }, 10);
    });
  });

  describe("when media context changes", function () {
    var count = 0;

    beforeEach(function () {
      adjust(el => el.setAttribute("adjusted", true))(element);

      window.matchMedia = sinon.stub();

      window.matchMedia.withArgs("small").returns({
        matches: false
      });

      query(element).each([
        media("small", [
          el => el.setAttribute("small", true),
          el => el.setAttribute("large", false)
        ]),
        adjust(function (el) {
          el.setAttribute("data-count", ++count)
        })
      ]);

      window.matchMedia.withArgs("small").returns({
        matches: true
      });

      resize();
    });

    it("should apply adjustments", function (done) {
      window.setTimeout(function () {
        element.getAttribute("data-count").should.equal("2");
        done();
      }, 10);
    });
  });
});
