import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";
import { Schema, SchemaReference } from "../../../src/interfaces/schema";

describe("Testing enum type for DocumentFactory", function () {
  it("1. Given a schema with enum type with a valid options array, the result document should have the enum property", function () {
    const validOptions = ["apple", "banana", "pear"];
    const schema: Schema = {
      test: {
        type: "enum",
        options: validOptions,
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
    expect(validOptions).to.include(resultDocument.test);
  });

  it("2. Given a schema with enum type with an invalid empty options array, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const emptyOptions = [];
    const schema: Schema = {
      test: {
        type: "enum",
        options: emptyOptions,
      },
    };

    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
    };

    expect(() => new DocumentFactory(config).generateDocument()).to.throw(
      "ENUM_OPTIONS_MUST_NOT_BE_EMPTY",
    );
  });

  it("3. Given a schema with enum type with an invalid null option, it should throw an error 'enum type options is not provided'", function () {
    const schema: Schema = {
      test: {
        type: "enum",
        options: null,
      },
    };

    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
    };

    expect(() => new DocumentFactory(config).generateDocument()).to.throw(
      "enum type options is not provided",
    );
  });

  it("4. Given a schema with enum type with a valid referenced options, the result document should have the enum property", function () {
    const references: SchemaReference = { sampleArray: ["apple"] };
    const schema: Schema = {
      test: {
        type: "enum",
        options: "#ref.sampleArray",
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
      references,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.equal("apple");
  });

  it("5. Given a schema with enum type with invalid referenced options, the result document should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const referenceWithEmptyArray: SchemaReference = { sampleArray: [] };
    const schema: Schema = {
      test: {
        type: "enum",
        options: "#ref.sampleArray",
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
      references: referenceWithEmptyArray,
    };

    expect(() => new DocumentFactory(config).generateDocument()).to.throw(
      "ENUM_OPTIONS_MUST_NOT_BE_EMPTY",
    );
  });

  it("6. Given a schema with enum type with non existing referenced options, the result document should throw an error 'invalid reference key'", function () {
    const emptyReference: SchemaReference = {};
    const schema: Schema = {
      test: {
        type: "enum",
        options: "#ref.sampleArray",
      },
    };

    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
      references: emptyReference,
    };

    expect(() => new DocumentFactory(config).generateDocument()).to.throw("invalid reference key");
  });

  it("7. Given a 100% chance of nullablePercentage, the result document should have the correct enum property with null value", function () {
    const validOptions = ["apple"];
    const maxNullablePercentage = 1;
    const schema: Schema = {
      test: {
        type: "enum",
        options: validOptions,
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
