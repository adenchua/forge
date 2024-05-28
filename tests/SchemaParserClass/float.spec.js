import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

describe("Testing float type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct property with a float value", function () {
    const schema = {
      test: {
        type: "float",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("number");
  });

  it("2. Given a 1.0 for min and max, it should return the correct property with 1.0 value", function () {
    const valueOfOne = 1.0;
    const schema = {
      test: {
        type: "float",
        options: {
          min: valueOfOne,
          max: valueOfOne,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.equal(1.0);
  });
});
