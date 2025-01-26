import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/DocumentFactoryClass";

describe("Testing float type for DocumentFactoryClass", function () {
  it("1. Given no parameters, it should return the correct property with a float value", function () {
    const schema = {
      test: {
        type: "float",
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("number");
  });

  it("2. Given a 1.0 for min and max, it should return the correct property with 1.0 value", function () {
    const valueOfOne = 1.0;
    const schema = {
      test: {
        type: "float",
        options: {
          min: valueOfOne,
          max: valueOfOne,
        },
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.equal(1.0);
  });

  it("3. Given a valid reference 'min' and 'max' option, it should return the correct value", function () {
    const schema = {
      test: {
        type: "float",
        options: {
          min: "#ref.key1",
          max: "#ref.key2",
        },
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {
      key1: 1.0,
      key2: 1.0,
    });

    const resultDocument = documentFactory.getDocument();
    expect(resultDocument.test).to.equal(1.0);
  });

  it("4. Given a invalid reference 'min' and 'max' option, it should throw an error 'REFERENCE_KEY_DOES_NOT_EXIST'", function () {
    const schema = {
      test: {
        type: "float",
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
