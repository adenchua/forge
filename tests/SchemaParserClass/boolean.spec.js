import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

describe("Testing boolean type for SchemaParserClass", function () {
  it("1. Given a schema Given boolean type, the result document should have the boolean property", function () {
    const schemaGivenBoolean = {
      test: {
        type: "boolean",
      },
    };
    const schemaParser = new SchemaParser(schemaGivenBoolean, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("boolean");
  });

  it("2. Given 100% nullable percentage, the result document should have the property Given null", function () {
    const maxNullablePercentage = 1;
    const schemaGivenBoolean = {
      test: {
        type: "boolean",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schemaGivenBoolean, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
