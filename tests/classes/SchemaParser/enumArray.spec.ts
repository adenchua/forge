import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";
import { Schema } from "../../../src/interfaces/schema";

describe("Testing enum-array type for DocumentFactory", function () {
  it("1. Given a valid options array, it should return the correct response", function () {
    const validOptions = ["apple"];
    const schema: Schema = {
      test: { type: "enum-array", options: validOptions },
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
    expect(resultDocument.test).to.be.a("array");
  });

  it("2. Given a empty options array, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const emptyArray = [];
    const schema: Schema = {
      test: { type: "enum-array", options: emptyArray },
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

  it("3. Given a null options array, it should throw an error 'enum-array type options is not provided", function () {
    const schema: Schema = {
      test: { type: "enum-array", options: null },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
    };
    expect(() => new DocumentFactory(config).generateDocument()).to.throw(
      "enum-array type options is not provided",
    );
  });

  it("4. Given a valid referenced array, it should return the correct response", function () {
    const referenceWithValidArray = { sampleArray: ["apple"] };
    const schema: Schema = {
      test: {
        type: "enum-array",
        options: "#ref.sampleArray",
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      references: referenceWithValidArray,
      globalNullablePercentage: 0,
    };
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.a("array");
  });

  it("5. Given an non existing referenced key, it should throw an error 'invalid reference key'", function () {
    const reference = {};
    const schema: Schema = {
      test: {
        type: "enum-array",
        options: "#ref.sampleArray",
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      references: reference,
      globalNullablePercentage: 0,
    };

    expect(() => new DocumentFactory(config).generateDocument()).to.throw("invalid reference key");
  });

  it("6. Given a 100% nullablePercentage, it should return the correct property with null value", function () {
    const maxNullablePercentage = 1;
    const schema: Schema = {
      test: {
        type: "enum-array",
        options: ["apple"],
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
