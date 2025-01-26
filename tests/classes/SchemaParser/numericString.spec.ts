import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/DocumentFactoryClass";

describe("Testing numeric-string for DocumentFactoryClass", function () {
  it("1. Given no parameters, it should return the correct result document with length 1 numeric string", function () {
    const schema = {
      test: {
        type: "numeric-string",
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.have.lengthOf(1);
    expect(resultDocument.test).to.be.a("string");
  });

  it("2. Given a min and max 2 length options, it should return the correct length numeric string", function () {
    const lengthOfTwo = 2;
    const schema = {
      test: {
        type: "numeric-string",
        options: {
          min: lengthOfTwo,
          max: lengthOfTwo,
        },
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.have.lengthOf(2);
  });

  it("3. Given leading zeros option, it should return zero left padded numeric string", function () {
    const sampleSize = 100; // should be large enough to find one sample with left-padded zero
    const schema = {
      test: {
        type: "numeric-string",
        options: {
          min: 2,
          max: 2,
          allowLeadingZeros: true,
        },
      },
    };
    let foundLeftPaddedZeroes = false;

    for (let i = 0; i < sampleSize; i++) {
      const documentFactory = new DocumentFactory(schema, 0, {});
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
    const schema = {
      test: {
        type: "numeric-string",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });

  it("5. Given a valid reference 'min' and 'max' option, it should return the text of correct length", function () {
    const schema = {
      test: {
        type: "numeric-string",
        options: {
          min: "#ref.key1",
          max: "#ref.key2",
        },
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {
      key1: 1,
      key2: 1,
    });

    const resultDocument = documentFactory.getDocument();
    expect(resultDocument.test).to.have.lengthOf(1);
  });

  it("6. Given a invalid reference 'min' and 'max' option, it should throw an error 'REFERENCE_KEY_DOES_NOT_EXIST'", function () {
    const schema = {
      test: {
        type: "numeric-string",
        options: {
          min: "#ref.key1",
          max: "#ref.key2",
        },
      },
    };
    const emptyReference = {};

    expect(() => new DocumentFactory(schema, 0, emptyReference)).to.throw(
      "REFERENCE_KEY_DOES_NOT_EXIST",
    );
  });
});
