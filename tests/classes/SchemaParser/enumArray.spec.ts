import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/classes/DocumentFactory";

describe("Testing enum-array type for DocumentFactoryClass", function () {
  it("1. Given a valid options array, it should return the correct response", function () {
    const validOptions = ["apple"];
    const schema = {
      test: { type: "enum-array", options: validOptions },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("array");
  });

  it("2. Given a empty options array, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const emptyArray = [];
    const schema = {
      test: { type: "enum-array", options: emptyArray },
    };

    expect(() => new DocumentFactory(schema, 0, {})).to.throw("ENUM_OPTIONS_MUST_NOT_BE_EMPTY");
  });

  it("3. Given a null options array, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_NULL", function () {
    const schema = {
      test: { type: "enum-array", options: null },
    };

    expect(() => new DocumentFactory(schema, 0, {})).to.throw("ENUM_OPTIONS_MUST_NOT_BE_NULL");
  });

  it("4. Given a valid referenced array, it should return the correct response", function () {
    const referenceWithValidArray = { sampleArray: ["apple"] };
    const schema = {
      test: {
        type: "enum-array",
        options: "#ref.sampleArray",
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, referenceWithValidArray);

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.a("array");
  });

  it("5. Given an non existing referenced key, it should throw an error 'REFERENCE_KEY_DOES_NOT_EXIST'", function () {
    const reference = {};
    const schema = {
      test: {
        type: "enum-array",
        options: "#ref.sampleArray",
      },
    };

    expect(() => new DocumentFactory(schema, 0, reference)).to.throw(
      "REFERENCE_KEY_DOES_NOT_EXIST",
    );
  });

  it("6. Given a 100% nullablePercentage, it should return the correct property with null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "enum-array",
        options: ["apple"],
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
