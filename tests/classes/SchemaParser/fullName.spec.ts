import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Schema } from "../../../src/interfaces/schema";
import { Config } from "../../../src/interfaces/core";

describe("Testing full name type for DocumentFactory", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema: Schema = {
      test: {
        type: "full-name",
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

  it("2. Given a invalid gender, it should throw an error 'fullName type provided gender '' is invalid'", function () {
    const invalidGender = "";
    const schema: Schema = {
      test: {
        type: "full-name",
        options: {
          gender: invalidGender,
        },
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
    };

    expect(() => new DocumentFactory(config).generateDocument()).to.throw(
      "fullName type provided gender '' is invalid",
    );
  });

  it("3. Given a valid gender, it should return the correct result document", function () {
    const validGender = "male";
    const schema: Schema = {
      test: {
        type: "full-name",
        options: {
          gender: validGender,
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

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});
