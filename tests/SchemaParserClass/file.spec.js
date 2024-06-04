import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/DocumentFactoryClass.js";

describe("Testing file type for DocumentFactoryClass", function () {
  it("1. Given a valid schema, it should return the correct response", function () {
    const schema = {
      test: {
        type: "file",
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });

  it("2. Given a 100% nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "file",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });

  it("3. Given a file type option, it should return the correct property with the provided file type", function () {
    const schema = {
      test: {
        type: "file",
        options: {
          extension: "mp4",
        },
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.contain(".mp4");
  });
});
