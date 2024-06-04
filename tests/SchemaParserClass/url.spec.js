import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/DocumentFactoryClass.js";
import { isValidUrl } from "../testUtils.js";

describe("Testing url type for DocumentFactoryClass", function () {
  it("1. Given no parameters, it should generate the correct result document", function () {
    const schema = {
      test: {
        type: "url",
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

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
      const documentFactory = new DocumentFactory(schema, 0, {});
      const resultDocument = documentFactory.getDocument();
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
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
