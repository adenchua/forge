import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

describe("Testing text type for SchemaParserClass", function () {
  it("1. Given no parameters with type text, it should return the correct result document with minimum of 5 words and maximum of 120 words", function () {
    const schema = {
      test: { type: "text" },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    const words = resultDocument.test?.split(" ");

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(words).to.have.length.greaterThanOrEqual(5).and.lessThanOrEqual(120);
  });

  it("2. Given a min and max of 1 with type text, it should return the correct result document with 1 word", function () {
    const schema = {
      test: {
        type: "text",
        options: {
          min: 1,
          max: 1,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    const words = resultDocument.test?.split(" ");

    expect(words).to.have.lengthOf(1);
  });

  it("3. Given null parameters for min and max, it should return the correct result document with minimum of 5 words and maximum of 120 words", function () {
    const schema = {
      test: {
        type: "text",
        options: {
          min: null,
          max: null,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    const words = resultDocument.test?.split(" ");

    expect(words).to.have.length.greaterThanOrEqual(5).and.lessThanOrEqual(120);
  });

  it("4. Given maximum nullablePercentage, it should return a property with a value null", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "text",
        options: {
          min: 1,
          max: 1,
        },
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
