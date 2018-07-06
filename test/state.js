/* jshint expr: true */
require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  on,
  setState,
  mirrorState,
  clearState,
  when,
  whenNot
} from "../src";

describe("when setting state", function () {
  var element;
  var stateChangeEvent;
  beforeEach(function () {
    element = document.createElement("div");
    query(element).each([
      on("jsua-style-state-change", (el, evt) => stateChangeEvent = evt),
      setState("hover")
    ]);
  });

  it("should raise a state change event", function () {
    should.exist(stateChangeEvent);
  });

  it("should have the new state", function () {
    element.jsuaStyleHasState("hover").should.be.true;
  });

  it("should indicate the state that changed", function () {
    stateChangeEvent.jsuaStyleState.should.equal("hover");
  });
});

describe("when mirroring the state of another element", function () {
  var element, mirrorElement;
  var stateChangeEvent;
  beforeEach(function () {
    element = document.createElement("div");
    mirrorElement = document.createElement("div");

    query(mirrorElement).each([
      mirrorState("hover", el => element),
      on("jsua-style-state-change", (el, evt) => stateChangeEvent = evt)
    ]);
    query(element).each(setState("hover"));
  });

  it("should raise a state change event on the mirror element", function () {
    should.exist(stateChangeEvent);
  });

  it("should have the new state on the mirror element", function () {
    mirrorElement.jsuaStyleHasState("hover").should.be.true;
  });

  it("should indicate the state that changed on the mirror element", function () {
    stateChangeEvent.jsuaStyleState.should.equal("hover");
  });
});

describe("when clearing state", function () {
  var element;
  var stateChangeEvent;
  beforeEach(function () {
    element = document.createElement("div");
    query(element).each([
      setState("hover"),
      on("jsua-style-state-change", (el, evt) => stateChangeEvent = evt),
      clearState("hover")
    ]);
  });

  it("should raise a state change event", function () {
    should.exist(stateChangeEvent);
  });

  it("should not have the cleared state", function () {
    element.jsuaStyleHasState("hover").should.be.false;
  });

  it("should indicate the state that changed", function () {
    stateChangeEvent.jsuaStyleState.should.equal("hover");
  });
});

describe("when applying conditional style", function () {
  describe("when the element is set to the state", function () {
    var element;
    beforeEach(function () {
      element = document.createElement("div");
      query(element).each([
        when("hover", el => el.hasHoverStyle = true),
        setState("hover")
      ]);
    });

    it("should apply conditional style", function () {
      element.hasHoverStyle.should.be.true;
    });
  });

  describe("when the element is already in state", function () {
    var element;
    beforeEach(function () {
      element = document.createElement("div");
      query(element).each([
        setState("hover"),
        when("hover", el => el.hasHoverStyle = true)
      ]);
    });

    it("should apply conditional style", function () {
      element.hasHoverStyle.should.be.true;
    });
  });

  describe("when the element is not in state", function () {
    var element;
    beforeEach(function () {
      element = document.createElement("div");
      query(element).each([
        when("other", el => el.hasHoverStyle = false),
        when("hover", el => el.hasHoverStyle = true),
        whenNot("hover", el => el.doesNotHaveHoverStyle = true),
        setState("hover"),
        setState("other"),
        clearState("hover"),
      ]);
    });

    it("should not apply conditional style", function () {
      element.hasHoverStyle.should.be.false;
    });

    it("should apply 'whenNot' conditional style", function () {
      element.doesNotHaveHoverStyle.should.be.true;
    });
  });

  describe("when the state has many values", function () {
    var element;
    beforeEach(function () {
      element = document.createElement("div");
      query(element).each([
        when("visibility", "visible", el => el.isVisible = true),
        when("visibility", "hidden", el => el.isVisible = false),
        setState("visibility", "visible"),
        setState("visibility", "hidden")
      ]);
    });

    it("should not apply style when the specific value matches", function () {
      element.isVisible.should.be.false;
    });
  });

  describe("when conditionally executing an array of functions", function () {
    var element;
    describe("when the state has a binary value", function () {
      beforeEach(function () {
        element = document.createElement("div");
        query(element).each([
          when("visibility", "visible", [
            [
              el => el.isVisible = true
            ]
          ]),
          setState("visibility", "visible")
        ]);
      });

      it("should execute the array of functions", function () {
        element.isVisible.should.be.true;
      });
    });

    describe("when the state has multiple values", function () {
      beforeEach(function () {
        element = document.createElement("div");
        query(element).each([
          when("hover", [
            [
              el => el.isHovering = true
            ]
          ]),
          setState("hover")
        ]);
      });

      it("should execute the array of functions", function () {
        element.isHovering.should.be.true;
      });
    });
  });
});
