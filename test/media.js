require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  mappers,
  map,
  component,
  media
} from "../src";

var sinon = require("sinon");

function resize() {
  var evt = document.createEvent("Event");
  evt.initEvent("resize", false, false);

  window.dispatchEvent(evt);
}

describe("when implementing responsive styling", function () {
  var element, matchesSmall;

  beforeEach(function () {
    if (window.matchMedia) {
      window.matchMedia = sinon.stub(window, 'matchMedia');
    } else {
      window.matchMedia = sinon.stub();
    }

    window.matchMedia.withArgs("small").returns({
      matches: true
    });

    window.matchMedia.withArgs("large").returns({
      matches: false
    });

    element = document.createElement("div");

    document.body.appendChild(element);

    query(element).each([
      media("small", [
        el => el.setAttribute("small", true),
        el => el.setAttribute("large", false)
      ]),
      media("large", [
        el => el.setAttribute("small", false),
        el => el.setAttribute("large", true)
      ]),
      media("small", el => el.setAttribute("small-again", true))
    ]);
  });

  afterEach(function () {
    document.body.removeChild(element);
    if (window.matchMedia.restore) {
      window.matchMedia.restore();
    } else {
      delete window.matchMedia;
    }
  });

  it("should apply matching styles", function () {
    element.getAttribute("small").should.equal("true");
    element.getAttribute("small-again").should.equal("true");
  });

  it("should not apply non-matching styles", function () {
    element.getAttribute("large").should.equal("false");
  });

  describe("when the media context changes", function () {
    beforeEach(function () {
      window.matchMedia.withArgs("small").returns({
        matches: false
      });

      window.matchMedia.withArgs("large").returns({
        matches: true
      });

      resize();
    });

    it("should apply matching styles", function () {
      element.getAttribute("small").should.equal("false");
    });

    it("should not apply non-matching styles", function () {
      element.getAttribute("large").should.equal("true");
    });

    describe("when the media context changes again", function () {
      beforeEach(function () {
        window.matchMedia.withArgs("small").returns({
          matches: true
        });

        window.matchMedia.withArgs("large").returns({
          matches: false
        });

        resize();
      });

      it("should apply matching styles", function () {
        element.getAttribute("small").should.equal("true");
      });

      it("should not apply non-matching styles", function () {
        element.getAttribute("large").should.equal("false");
      });
    });
  });
});
