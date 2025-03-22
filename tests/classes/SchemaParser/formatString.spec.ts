import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";
import { Schema } from "../../../src/interfaces/schema";

describe("Testing format string type for DocumentFactory", function () {
  it("1. Given valid parameters, it should return the correct result document", function () {
    const schema: Schema = {
      test: {
        type: "format-string",
        options: {
          pattern: "{}_{}",
          properties: [
            {
              type: "enum",
              options: ["apple"],
            },
            {
              type: "enum",
              options: ["pear"],
            },
          ],
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
    expect(resultDocument.test).to.equal("apple_pear");
  });

  it("2. Given 100% nullablePercentage, it should return the correct property with null value", function () {
    const maxNullablePercentage = 1;
    const schema: Schema = {
      test: {
        type: "format-string",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
        options: {
          pattern: "{}_{}",
          properties: [
            {
              type: "enum",
              options: ["apple"],
            },
            {
              type: "enum",
              options: ["pear"],
            },
          ],
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
    expect(resultDocument.test).to.be.null;
  });
});
