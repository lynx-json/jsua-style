require("./html-document-api");
const chai = require("chai");
const should = chai.should();
import {
  query,
  mappers,
  map,
  component
} from "../src";

describe("when mapping next siblings", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div id="two"></div>
    <div id="three"></div>
    <div id="four"></div>
    <div id="five"></div>
    `;

    results = [];
    query(element).select("#three").map(mappers.nextSiblings()).each(el => results.push(el));
  });
  it("should select all later siblings from nearest to farthest", function () {
    results.length.should.equal(2);
    results[0].id.should.equal("four");
    results[1].id.should.equal("five");
  });

  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("#two").map(mappers.nextSiblings("#five")).each(el => results.push(el));
    });

    it("should return the filtered results", function () {
      results.length.should.equal(1);
      results[0].id.should.equal("five");
    });
  });
});

describe("when mapping previous siblings", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div id="two"></div>
    <div id="three"></div>
    <div id="four"></div>
    <div id="five"></div>
    `;

    results = [];
    query(element).select("#four").map(mappers.previousSiblings()).each(el => results.push(el));
  });
  it("should select all previous siblings from nearest to farthest", function () {
    results.length.should.equal(2);
    results[0].id.should.equal("three");
    results[1].id.should.equal("two");
  });

  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("#five").map(mappers.previousSiblings("#two")).each(el => results.push(el));
    });

    it("should return the filtered results", function () {
      results.length.should.equal(1);
      results[0].id.should.equal("two");
    });
  });
});

describe("when mapping ancestors", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div id="two">
      <div id="three"></div>
    </div>
    <div id="four">
      <div id="five"></div>
    </div>
    `;

    results = [];
    query(element).select("#three").map(mappers.ancestors()).each(el => results.push(el));
  });
  it("should select all ancestors from nearest to farthest", function () {
    results.length.should.equal(2);
    results[0].id.should.equal("two");
    results[1].id.should.equal("one");
  });

  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("*").map(mappers.ancestors("#two")).each(el => results.push(el));
    });

    it("should return the filtered results", function () {
      results[0].id.should.equal("two");
    });
  });
});

describe("when mapping descendants", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div id="two">
      <div id="three"></div>
    </div>
    <div id="four">
      <div id="five"></div>
    </div>
    `;

    results = [];
    query(element).map(mappers.descendants()).each(el => results.push(el));
  });
  it("should select all descendants in document order", function () {
    results.length.should.equal(4);
    results[0].id.should.equal("two");
    results[1].id.should.equal("three");
    results[2].id.should.equal("four");
    results[3].id.should.equal("five");
  });

  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).map(mappers.descendants("#two")).each(el => results.push(el));
    });

    it("should return the filtered results", function () {
      results[0].id.should.equal("two");
    });
  });
});

describe("when mapping real children", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "root";

    element.innerHTML = `
    <div role="presentation">
      <div id="one"></div>
    </div>
    <div role="presentation">
      <div role="presentation">
        <div id="two"></div>
      </div>
    </div>
    `;

    results = [];
    query(element).map(mappers.realChildren()).each(el => results.push(el));
  });
  it("should select descendants separated from the element by only presentational elements", function () {
    results.length.should.equal(2);
    results[0].id.should.equal("one");
    results[1].id.should.equal("two");
  });

  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).map(mappers.realChildren("#two")).each(el => results.push(el));
    });

    it("should return the filtered results", function () {
      results[0].id.should.equal("two");
    });
  });

  describe("when excluding elements with a filter", function () {
    beforeEach(function () {
      element = document.createElement("div");
      element.id = "root";

      element.innerHTML = `
      <div role="presentation">
        <div id="one"></div>
      </div>
      <div role="presentation">
        <div data-lynx-hints="content">
          <div id="two"></div>
        </div>
      </div>
      `;

      results = [];
      query(element).map(mappers.realChildren("#two", "[data-lynx-hints~=content]")).each(el => results.push(el));
    });

    it("should select descendants separated from the element by elements matching the exclusion filter", function () {
      results[0].id.should.equal("two");
    });
  })
});

describe("when mapping children", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");

    element.innerHTML = `
    <div role="presentation" id="one"><div></div></div>
    <div role="presentation" id="two"><div></div></div>
    `;

    results = [];
    query(element).map(mappers.children()).each(el => results.push(el));
  });

  it("should select direct children of the element", function () {
    results.length.should.equal(2);
    results[0].id.should.equal("one");
    results[1].id.should.equal("two");
  });

  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).map(mappers.children("#two")).each(el => results.push(el));
    });

    it("should return the filtered results", function () {
      results[0].id.should.equal("two");
    });
  });
});

describe("when mapping the real parent", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "root";

    element.innerHTML = `
    <div role="presentation">
      <div id="one"></div>
    </div>
    <div>
      <div role="presentation">
        <div id="two"></div>
      </div>
    </div>
    `;

    results = [];
    query(element).select("#one, #two").map(mappers.realParent("#root")).each(el => results.push(el));
  });

  it("should select ancestors separated from the element by only presentational elements", function () {
    results.length.should.equal(1);
    results[0].should.equal(element);
  });

  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("#one").map(mappers.realParent("#other")).each(el => results.push(el));
    });

    it("should return the filtered results", function () {
      results.length.should.equal(0);
    });
  });

  describe("when excluding elements with an exclude filter", function () {
    element = document.createElement("div");
    element.id = "root";

    element.innerHTML = `
    <div role="presentation">
      <div id="one"></div>
    </div>
    <div>
      <div data-lynx-hints="content">
        <div id="two"></div>
      </div>
    </div>
    `;

    results = [];
    query(element).select("#one, #two").map(mappers.realParent("#root", "[data-lynx-hints~=content]")).each(el => results.push(el));

    it("should select ancestors separated from the element by only excluded elements", function () {
      results.length.should.equal(1);
      results[0].should.equal(element);
    });
  })
});

describe("when mapping to a parent", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");
    element.id = "one";

    element.innerHTML = `
    <div role="presentation">
      <div id="one"></div>
    </div>
    <div role="presentation">
      <div role="presentation">
        <div id="two"></div>
      </div>
    </div>
    `;

    results = [];
    query(element).select("#one").map(mappers.parent()).each(el => results.push(el));
  });
  it("should select the element's parent element", function () {
    results.length.should.equal(1);
    results[0].should.equal(element.firstElementChild);
  });

  describe("when including a filter", function () {
    beforeEach(function () {
      results = [];
      query(element).select("#one").map(mappers.parent(":not([role=presentation])")).each(el => results.push(el));
    });

    it("should return the filtered results", function () {
      results.length.should.equal(0);
    });
  });
});

describe("when mapping to a slot", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");

    var innerHTML = `
    <div data-jsua-style-slot="header" id="one"></div>
    <div data-jsua-style-slot="footer" id="two"></div>
    `;

    query(element).each(component("test-component", innerHTML));

    results = [];
    query(element).map(mappers.slot("header")).each(el => results.push(el));
  });

  it("should select the component's slot by that name", function () {
    results.length.should.equal(1);
    results[0].should.equal(element.firstElementChild);
  });

  describe("when the element uses multiple components", function () {
    beforeEach(function () {
      var innerHTML = `
      <div data-jsua-style-slot="header" id="three"></div>
      <div data-jsua-style-slot="footer" id="four"></div>
      `;

      query(element).each(component("test-component-two", innerHTML));
      results = [];
      query(element).map(mappers.slot("header", "test-component")).each(el => results.push(el));
      query(element).map(mappers.slot("header", "test-component-two")).each(el => results.push(el));
    });

    it("should select the slot for the requested component", function () {
      results.length.should.equal(2);
      results[0].id.should.equal("one");
      results[1].id.should.equal("three");
    });
  });
});

describe("when mapping to a wrapper", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");

    element.innerHTML = `
    <div id="one"></div>
    <div id="two"></div>
    `;

    results = [];
    query(element).map(mappers.children()).each([
      map(mappers.wrapper(), [
        el => results.push(el)
      ])
    ]);
  });

  it("should wrap each selected element", function () {
    results[0].should.equal(element.querySelector("#one").parentElement);
    results[1].should.equal(element.querySelector("#two").parentElement);
  });

  it("should replace each selected element with its new wrapper", function () {
    results[0].should.equal(element.firstElementChild);
    results[1].should.equal(element.lastElementChild);
  });

  it("should give each wrapper a role of `presentation`", function () {
    results[0].getAttribute("role").should.equal("presentation");
    results[1].getAttribute("role").should.equal("presentation");
  });
});

describe("when mapping by position", function () {
  var element, results;
  beforeEach(function () {
    element = document.createElement("div");

    element.innerHTML = `
    <div id="one"></div>
    <div id="two"></div>
    <div id="three"></div>
    <div id="four"></div>
    `;
  });

  // describe("when mapping to the first element of a set");
  // describe("when mapping to the last element of a set");
  // describe("when mapping to the nth element of a set");
  describe("when mapping to even elements in a set", function () {
    beforeEach(function () {
      results = [];
      query(element).map(mappers.even(mappers.children())).each(el => results.push(el));
    });

    it("should select only even elements from the mapped set", function () {
      results[0].id.should.equal("two");
      results[1].id.should.equal("four");
    });
  });
  describe("when mapping to odd elements in a set", function () {
    beforeEach(function () {
      results = [];
      query(element).map(mappers.odd(mappers.children())).each(el => results.push(el));
    });

    it("should select only even elements from the mapped set", function () {
      results[0].id.should.equal("one");
      results[1].id.should.equal("three");
    });
  });
});
