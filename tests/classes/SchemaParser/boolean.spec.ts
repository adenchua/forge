import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";

describe("Testing boolean type for DocumentFactory", function () {
  it("1. Given a schema Given boolean type, the result document should have the boolean property", function () {
    const config: Config = {
      recipe: {
        schema: {
          test: {
            type: "boolean",
          },
        },
      },
      globalNullablePercentage: 0,
    };
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("boolean");
  });

  it("2. Given 100% nullable percentage, the result document should have the property Given null", function () {
    const maxNullablePercentage = 1;
    const config: Config = {
      recipe: {
        schema: {
          test: {
            type: "boolean",
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
