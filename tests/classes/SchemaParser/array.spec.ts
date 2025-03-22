import { expect } from "chai";
import { describe, it } from "mocha";

import { AssertionError } from "node:assert";
import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";

describe("Testing array type for DocumentFactory", function () {
  it("1. Given no parameters, it should throw an error 'AssertionError'", function () {
    const config: Config = {
      recipe: {
        schema: {
          test: {
            type: "array",
          },
        },
      },
      globalNullablePercentage: 0,
    };
    const documentFactory = new DocumentFactory(config);

    expect(() => documentFactory.generateDocument()).to.throw(AssertionError);
  });

  it("2. Given a valid schema option, it should return the correct result document", function () {
    const config: Config = {
      recipe: {
        schema: {
          test: {
            type: "array",
            options: {
              min: 1,
              max: 1,
              schema: {
                type: "boolean",
              },
            },
          },
        },
      },
      globalNullablePercentage: 0,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("array");
  });

  it("3. Given a schema with min and max of 1, it should return an array of size 1", function () {
    const arraySizeOne = 1;
    const config: Config = {
      recipe: {
        schema: {
          test: {
            type: "array",
            options: {
              schema: {
                type: "boolean",
              },
              min: arraySizeOne,
              max: arraySizeOne,
            },
          },
        },
      },
      globalNullablePercentage: 0,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.have.lengthOf(1);
  });

  it("4. Given a schema with null min and max, it should throw an 'AssertionError'", function () {
    const config: Config = {
      recipe: {
        schema: {
          test: {
            type: "array",
            options: {
              schema: {
                type: "boolean",
              },
              min: null,
              max: null,
            },
          },
        },
      },
      globalNullablePercentage: 0,
    };
    const documentFactory = new DocumentFactory(config);

    expect(() => documentFactory.generateDocument()).to.throw(AssertionError);
  });

  it("5. Given a 100% nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const config: Config = {
      recipe: {
        schema: {
          test: {
            type: "array",
            options: {
              schema: {
                type: "boolean",
              },
            },
            isNullable: true,
            nullablePercentage: maxNullablePercentage,
          },
        },
      },
      globalNullablePercentage: 0,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});
