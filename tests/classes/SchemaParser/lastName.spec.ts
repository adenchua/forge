import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/DocumentFactoryClass";

describe("Testing last name type for DocumentFactoryClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "last-name",
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });

  it("2. Given a invalid gender, it should throw an error 'INVALID_GENDER_PROVIDED'", function () {
    const invalidGender = "";
    const schema = {
      test: {
        type: "last-name",
        options: {
          gender: invalidGender,
        },
      },
    };

    expect(() => new DocumentFactory(schema, 0, {})).to.throw("INVALID_GENDER_PROVIDED");
  });

  it("3. Given a valid gender, it should return the correct result document", function () {
    const validGender = "male";
    const schema = {
      test: {
        type: "last-name",
        options: {
          gender: validGender,
        },
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});
