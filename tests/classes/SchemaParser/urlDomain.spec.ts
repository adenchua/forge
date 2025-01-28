import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/classes/DocumentFactory";

describe("Testing url-domain type for DocumentFactoryClass", function () {
  it("1. Given no parameters, it should generate the correct result document", function () {
    const schema = {
      test: {
        type: "url-domain",
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });

  it("2. Given max nullable percentage, it should return the correct property with a null value", function () {
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
