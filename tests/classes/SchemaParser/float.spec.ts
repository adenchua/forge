import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Schema } from "../../../src/interfaces/schema";
import { Config } from "../../../src/interfaces/core";

describe("Testing float type for DocumentFactory", function () {
  it("1. Given no parameters, it should return the correct property with a float value", function () {
    const schema: Schema = {
      test: {
        type: "float",
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
    expect(resultDocument.test).to.be.a("number");
  });

  it("2. Given a 1.0 for min and max, it should return the correct property with 1.0 value", function () {
    const valueOfOne = 1.0;
    const schema: Schema = {
      test: {
        type: "float",
        options: {
          min: valueOfOne,
          max: valueOfOne,
        },
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

    expect(resultDocument.test).to.equal(1.0);
  });

  it("3. Given a valid reference 'min' and 'max' option, it should return the correct value", function () {
    const references = {
      key1: 1.0,
      key2: 1.0,
    };
    const schema: Schema = {
      test: {
        type: "float",
        options: {
          min: "#ref.key1",
          max: "#ref.key2",
        },
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

    expect(resultDocument.test).to.equal(1.0);
  });

  it("4. Given a invalid reference 'min' and 'max' option, it should throw an error 'invalid reference key'", function () {
    const emptyReference = {};
    const schema: Schema = {
      test: {
        type: "float",
        options: {
          min: "#ref.key1",
          max: "#ref.key2",
        },
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
});
