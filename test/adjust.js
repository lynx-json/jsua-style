require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import { adjust, applyAdjustments, query, media } from "../src";
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

  describe("when adjusting after finishing is complete", function () {
    var count = 0;

    beforeEach(function () {
      var child = document.createElement("div");
      element.appendChild(child);

      adjust(el => el.setAttribute("adjusted", ++count))(element);
      adjust(el => el.setAttribute("adjusted", ++count))(child);

      applyAdjustments();
    });

    it("should apply adjustments in reverse document order", function () {
      element.getAttribute("adjusted").should.equal("2");
      element.firstElementChild.getAttribute("adjusted").should.equal("1");
    });
  });

  describe("when adjusting after media context changes", function () {
    var count = 0;

    beforeEach(function () {
      adjust(el => el.setAttribute("adjusted", true))(element);

      window.matchMedia = sinon.stub(window, 'matchMedia');

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

      window.matchMedia.returns({
        matches: false
      });

      window.matchMedia.withArgs("small").returns({
        matches: true
      });

      resize();
    });

    afterEach(function () {
      window.matchMedia.restore();
    });

    it("should apply adjustments", function () {
      element.getAttribute("data-count").should.equal("1");
    });
  });
});
