import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";
import { isValidUrl } from "../testUtils.js";

describe("Testing url type for SchemaParserClass", function () {
  it("1. Given no parameters, it should generate the correct result document", function () {
    const schema = {
      test: {
        type: "url",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(isValidUrl(resultDocument.test)).to.be.true;
  });

  it("2. Given allowsNumbers parameter, it should generate the correct result document", function () {
    const schema = {
      test: {
        type: "url",
        options: {
          allowNumbers: true,
        },
      },
    };
    let consistOfNumbers = false;
    const sampleSize = 100;
    const regExpMatchAnyDigits = /\/\d+/;

    for (let i = 0; i < sampleSize; i++) {
      const schemaParser = new SchemaParser(schema, 0, {});
      const resultDocument = schemaParser.getDocument();
      if (!!resultDocument.test.match(regExpMatchAnyDigits)) {
        consistOfNumbers = true;
        break;
      }
    }

    expect(consistOfNumbers).to.be.true;
  });

  it("3. Given max nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "url",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
