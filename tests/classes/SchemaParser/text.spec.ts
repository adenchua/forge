import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Schema } from "../../../src/interfaces/schema";
import { Config } from "../../../src/interfaces/core";

describe("Testing text type for DocumentFactory", function () {
  it("1. Given no parameters with type text, it should return the correct result document with minimum of 5 words and maximum of 120 words", function () {
    const schema: Schema = {
      test: { type: "text" },
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
    const words = resultDocument.test?.split(" ");

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(words).to.have.length.greaterThanOrEqual(5).and.lessThanOrEqual(120);
  });

  it("2. Given a min and max of 1 with type text, it should return the correct result document with 1 word", function () {
    const schema: Schema = {
      test: {
        type: "text",
        options: {
          min: 1,
          max: 1,
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
    const words = resultDocument.test?.split(" ");

    expect(words).to.have.lengthOf(1);
  });

  it("3. Given null parameters for min and max, it should return the correct result document with minimum of 5 words and maximum of 120 words", function () {
    const schema: Schema = {
      test: {
        type: "text",
        options: {
          min: null,
          max: null,
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
    const words = resultDocument.test?.split(" ");

    expect(words).to.have.length.greaterThanOrEqual(5).and.lessThanOrEqual(120);
  });

  it("4. Given maximum nullablePercentage, it should return a property with a value null", function () {
    const maxNullablePercentage = 1;
    const schema: Schema = {
      test: {
        type: "text",
        options: {
          min: 1,
          max: 1,
        },
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

  it("5. Given a valid reference 'min' and 'max' option, it should return the text of correct length", function () {
    const schema: Schema = {
      test: {
        type: "text",
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
      references: {
        key1: 1,
        key2: 1,
      },
    };
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();
    const words = resultDocument.test.split(" ");
    expect(words).to.have.lengthOf(1);
  });

  it("6. Given a invalid reference 'min' and 'max' option, it should throw an error 'invalid reference key'", function () {
    const schema: Schema = {
      test: {
        type: "text",
        options: {
          min: "#ref.key1",
          max: "#ref.key2",
        },
      },
    };
    const emptyReference = {};
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
