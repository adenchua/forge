import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";

describe("Testing country-code type for DocumentFactory", function () {
  it("1. Given a valid schema, it should return the correct response", function () {
    const config: Config = {
      recipe: {
        schema: {
          test: {
            type: "country-code",
          },
        },
      },
      globalNullablePercentage: 0,
    };
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });

  it("2. Given a 100% nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const config: Config = {
      recipe: {
        schema: {
          test: {
            type: "country-code",
            isNullable: true,
            nullablePercentage: maxNullablePercentage,
          },
        },
      },
      globalNullablePercentage: 0,
    };
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
