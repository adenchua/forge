import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";
import { isValidEmail } from "../testUtils.js";

describe("Testing email type for SchemaParserClass", function () {
  it("1. Given a valid schema, it should return the correct response", function () {
    const schema = {
      test: {
        type: "email",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(isValidEmail(resultDocument.test)).to.be.true;
  });

  it("2. Given a 100% nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "email",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
