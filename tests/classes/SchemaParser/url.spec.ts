import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { isValidUrl } from "../../testUtils";
import { Schema } from "../../../src/interfaces/schema";
import { Config } from "../../../src/interfaces/core";

describe("Testing url type for DocumentFactory", function () {
  it("1. Given no parameters, it should generate the correct result document", function () {
    const schema: Schema = {
      test: {
        type: "url",
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
    };
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(isValidUrl(resultDocument.test)).to.be.true;
  });

  it("2. Given allowsNumbers parameter, it should generate the correct result document", function () {
    const schema: Schema = {
      test: {
        type: "url",
        options: {
          allowNumbers: true,
        },
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
    };
    let consistOfNumbers = false;
    const sampleSize = 100;
    const regExpMatchAnyDigits = /\/\d+/;

    for (let i = 0; i < sampleSize; i++) {
      const documentFactory = new DocumentFactory(config);
      documentFactory.generateDocument();
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
    const schema: Schema = {
      test: {
        type: "url",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
    };
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
