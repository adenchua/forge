import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

describe("Testing number type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "number",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("number");
  });

  it("2. Given a min and max option of 1, it should return 1", function () {
    const schema = {
      test: {
        type: "number",
        options: {
          min: 1,
          max: 1,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.equal(1);
  });

  it("3. Given a null min and max option, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "number",
        options: {
          min: null,
          max: null,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.a("number");
  });

  it("4. Given a max nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "number",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    expect(resultDocument.test).to.be.null;
  });
});
