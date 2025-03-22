import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";
import { Schema } from "../../../src/interfaces/schema";

describe("Testing numeric-string for DocumentFactory", function () {
  it("1. Given no parameters, it should return the correct result document with length 1 numeric string", function () {
    const schema: Schema = {
      test: {
        type: "numeric-string",
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
  });

  it("2. Given a min and max 2 length options, it should return the correct length numeric string", function () {
    const lengthOfTwo = 2;
    const schema: Schema = {
      test: {
        type: "numeric-string",
        options: {
          min: lengthOfTwo,
          max: lengthOfTwo,
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

    expect(resultDocument.test).to.have.lengthOf(2);
  });

  it("3. Given leading zeros option, it should return zero left padded numeric string", function () {
    const sampleSize = 100; // should be large enough to find one sample with left-padded zero
    const schema: Schema = {
      test: {
        type: "numeric-string",
        options: {
          min: 2,
          max: 2,
          allowLeadingZeros: true,
        },
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
    };

    let foundLeftPaddedZeroes = false;

    for (let i = 0; i < sampleSize; i++) {
      const documentFactory = new DocumentFactory(config);
      documentFactory.generateDocument();
      const resultDocument = documentFactory.getDocument();

      if (resultDocument.test[0] === "0") {
        foundLeftPaddedZeroes = true;
        break;
      }
    }

    expect(foundLeftPaddedZeroes).to.be.true;
  });

  it("4. Given a max nullable percentage, it should return a property with value null", function () {
    const maxNullablePercentage = 1;
    const schema: Schema = {
      test: {
        type: "numeric-string",
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
        type: "numeric-string",
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

    expect(resultDocument.test).to.have.lengthOf(1);
  });

  it("6. Given a invalid reference 'min' and 'max' option, it should throw an error 'invalid reference key'", function () {
    const schema: Schema = {
      test: {
        type: "numeric-string",
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
