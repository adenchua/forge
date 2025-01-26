import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/DocumentFactoryClass";

describe("Testing boolean type for DocumentFactoryClass", function () {
  it("1. Given a schema Given boolean type, the result document should have the boolean property", function () {
    const schemaGivenBoolean = {
      test: {
        type: "boolean",
      },
    };
    const documentFactory = new DocumentFactory(schemaGivenBoolean, 0, {});

    const resultDocument = documentFactory.getDocument();

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
    const documentFactory = new DocumentFactory(schemaGivenBoolean, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
