import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/DocumentFactoryClass";

describe("Testing enum type for DocumentFactoryClass", function () {
  it("1. Given a schema with enum type with a valid options array, the result document should have the enum property", function () {
    const validOptions = ["apple", "banana", "pear"];
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: validOptions,
      },
    };
    const documentFactory = new DocumentFactory(schemaWithEnum, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(validOptions).to.include(resultDocument.test);
  });

  it("2. Given a schema with enum type with an invalid empty options array, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const emptyOptions = [];
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: emptyOptions,
      },
    };

    expect(() => new DocumentFactory(schemaWithEnum, 0, {})).to.throw(
      "ENUM_OPTIONS_MUST_NOT_BE_EMPTY",
    );
  });

  it("3. Given a schema with enum type with an invalid null option, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_NULL'", function () {
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: null,
      },
    };

    expect(() => new DocumentFactory(schemaWithEnum, 0, {})).to.throw(
      "ENUM_OPTIONS_MUST_NOT_BE_NULL",
    );
  });

  it("4. Given a schema with enum type with a valid referenced options, the result document should have the enum property", function () {
    const references = { sampleArray: ["apple"] };
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: "#ref.sampleArray",
      },
    };
    const documentFactory = new DocumentFactory(schemaWithEnum, 0, references);

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.equal("apple");
  });

  it("5. Given a schema with enum type with invalid referenced options, the result document should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const referenceWithEmptyArray = { sampleArray: [] };
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: "#ref.sampleArray",
      },
    };

    expect(() => new DocumentFactory(schemaWithEnum, 0, referenceWithEmptyArray)).to.throw(
      "ENUM_OPTIONS_MUST_NOT_BE_EMPTY",
    );
  });

  it("6. Given a schema with enum type with non existing referenced options, the result document should throw an error 'REFERENCE_KEY_DOES_NOT_EXIST'", function () {
    const emptyReference = {};
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: "#ref.sampleArray",
      },
    };

    expect(() => new DocumentFactory(schemaWithEnum, 0, emptyReference)).to.throw(
      "REFERENCE_KEY_DOES_NOT_EXIST",
    );
  });

  it("7. Given a 100% chance of nullablePercentage, the result document should have the correct enum property with null value", function () {
    const validOptions = ["apple"];
    const maxNullablePercentage = 1;
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: validOptions,
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const documentFactory = new DocumentFactory(schemaWithEnum, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
