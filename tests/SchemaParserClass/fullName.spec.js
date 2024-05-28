import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

describe("Testing full name type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "full-name",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });

  it("2. Given a invalid gender, it should throw an error 'INVALID_GENDER_PROVIDED'", function () {
    const invalidGender = "";
    const schema = {
      test: {
        type: "full-name",
        options: {
          gender: invalidGender,
        },
      },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("INVALID_GENDER_PROVIDED");
  });

  it("3. Given a valid gender, it should return the correct result document", function () {
    const validGender = "male";
    const schema = {
      test: {
        type: "full-name",
        options: {
          gender: validGender,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});
