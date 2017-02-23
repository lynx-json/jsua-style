const chai = require("chai");
const should = chai.should();
import query from "../src";

describe.only("when querying", function () {
  it("should query an element", function () {
    var element = {};
    query(element).each(el => el.selected = true);
    element.selected.should.equal(true);
  });
  
  it("should query an iterable of elements", function () {
    var element = {};
    query([element]).each(el => el.selected = true);
    element.selected.should.equal(true);
  });
  
  describe("and selecting elements based on a predicate", function () {
    it("should select the element itself if the element matches the selector", function () {
      var element = {
        querySelectorAll: () => []
      };
      query([element]).select(el => true).each(el => el.selected = true);
      element.selected.should.equal(true);
    });
    
    it("should select the element's descendants if they match the selector", function () {
      var element = {
        querySelectorAll: () => [{}, {}, {}]
      };
      var count = 0;
      query([element]).select(el => true).each(el => count += 1);
      count.should.equal(4);
    });
    
    it("should not select elements that do not match the selector", function () {
      var element = {
        querySelectorAll: () => [{}, {}, {}]
      };
      var count = 0;
      query([element]).select(el => false).each(el => count += 1);
      count.should.equal(0);
    });
    
    it("should not iterate until execution", function () {
      var element = {
        querySelectorAll: () => [{}, {}, {}]
      };
      var count = 0;
      var q = query([element]).select(function (el) {
        count += 1;
        return true;
      });
      
      count.should.equal(0);
      q.each(el => el);
      count.should.equal(4);
    });
  });
  
  describe("and selecting elements based on a CSS selector", function () {
    it("should select the element itself if the element matches the selector", function () {
      var selector = "*";
      var element = {
        matches: sel => sel === "*" ? true : false,
        querySelectorAll: sel => []
      };
      query([element]).select(selector).each(el => el.selected = true);
      element.selected.should.equal(true);
    });
    
    it("should select all descendants matching the selector", function () {
      var selector = "*";
      var element = {
        matches: sel => sel === "*" ? true : false,
        querySelectorAll: sel => sel === selector ? [{}, {}, {}] : []
      };
      var count = 0;
      query([element]).select(selector).each(el => count += 1);
      count.should.equal(4);
    });
    
    it("should not select elements that do not match the selector", function () {
      var selector = "*";
      var element = {
        matches: sel => sel === "*" ? true : false,
        querySelectorAll: sel => sel === selector ? [{}, {}, {}] : []
      };
      var count = 0;
      query([element]).select(":not(*)").each(el => count += 1);
      count.should.equal(0);
    });
    
    it("should not iterate until execution", function () {
      var selector = "*";
      var count = 0;
      var element = {
        matches: function (selector) {
          count += 1;
          return true;
        },
        querySelectorAll: function (selector) {
          count += 1;
          return []
        }
      };
      
      var q = query([element]).select(selector);
      
      count.should.equal(0);
      q.each(el => el);
      count.should.equal(2);
    });
  });
  
  describe("and mapping to a new selection", function () {
    it("should support one-to-one mapping", function () {
      var element = {
        querySelectorAll: () => []
      };
      var mappedElement = {};
      
      query(element).map(el => mappedElement).each(el => el.selected = true);
      mappedElement.selected.should.equal(true);
      (!!element.selected).should.equal(false);
    });
    
    it("should support one-to-many mapping", function () {
      var element = {
        querySelectorAll: () => []
      };
      var mappedElements = [{}, {}];
      
      query(element).map(el => mappedElements).each(el => el.selected = true);
      mappedElements[0].selected.should.equal(true);
      mappedElements[1].selected.should.equal(true);
      (!!element.selected).should.equal(false);
    });
  });
  
  describe("and iterating over each selected element", function () {
    it("should execute a function for each selected element", function () {
      var descendants = [{}];
      var element = {
        querySelectorAll: () => descendants
      };
      
      query([element]).select(el => true).each(el => el.modified = true);
      element.modified.should.equal(true);
      descendants[0].modified.should.equal(true);
    });
    
    it("should execute a function or an array of functions", function () {
      var element = {
        querySelectorAll: () => []
      };
      
      query([element]).select(el => true).each([
        el => el.modified = true,
        el => el.modifiedAgain = true
      ]);
      element.modified.should.equal(true);
      element.modifiedAgain.should.equal(true);
    });
    
    it("should not execute a function on the same element twice", function () {
      var element = {
        querySelectorAll: () => []
      };
      
      query([element]).map(el => [element, element]).each(function (el) {
        element.count = element.count || 0;
        element.count += 1;
      });
      element.count.should.equal(1);
    });
    
    it("should ignore null selections", function () {
      var element = {
        querySelectorAll: () => []
      };
      
      var count = 0;
      query([element]).map(el => null).each(function (el) {
        count += 1;
      });
      count.should.equal(0);
    });
    
    it("should support chaining", function () {
      var element = {
        querySelectorAll: () => []
      };
      
      var count = 0;
      query([element]).each(el => count += 1).each(el => count += 1);
      count.should.equal(2);
    });
  });
  
  describe("and filtering", function () {
    describe("by predicate", function () {
      it("should select only elements matching the predicate", function () {
        var matchingElement = { matches: true, querySelectorAll: () => [] };
        var nonMatchingElement = { matches: false, querySelectorAll: () => [] };
        
        query([matchingElement, nonMatchingElement]).filter(el => el.matches).each(el => el.selected = true);
        matchingElement.selected.should.equal(true);
        should.not.exist(nonMatchingElement.selected);
      });
    });
    
    describe("by CSS selector", function () {
      it("should select only elements matching the CSS selector", function () {
        var matchingChild = { matches: sel => true, querySelectorAll: () => [] };
        var nonMatchingChild = { matches: sel => false, querySelectorAll: () => [] };
        var element = {
          querySelectorAll: () => [matchingChild, nonMatchingChild],
          matches: () => sel => false
        };
        
        query(element).select("*").filter("matching").each(el => el.selected = true);
        matchingChild.selected.should.equal(true);
        should.not.exist(nonMatchingChild.selected);
      });
    });
  });
});
