import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/DocumentFactoryClass";

describe("Testing array type for DocumentFactoryClass", function () {
  it("1. Given no parameters, it should throw an error 'ARRAY_SCHEMA_NOT_PROVIDED'", function () {
    const schema = {
      test: {
        type: "array",
      },
    };

    expect(() => new DocumentFactory(schema, 0, {})).to.throw("ARRAY_SCHEMA_NOT_PROVIDED");
  });

  it("2. Given a valid schema option, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "array",
        options: {
          schema: {
            type: "boolean",
          },
        },
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("array");
  });

  it("3. Given a schema with min and max of 1, it should return an array of size 1", function () {
    const arraySizeOne = 1;
    const schema = {
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
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.have.lengthOf(1);
  });

  it("4. Given a schema with null min and max, it should throw an error 'MIN_MAX_OPTIONS_MUST_BE_A_NUMBER'", function () {
    const schema = {
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
    };

    expect(() => new DocumentFactory(schema, 0, {})).to.throw("MIN_MAX_OPTIONS_MUST_BE_A_NUMBER");
  });

  it("5. Given a 100% nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
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
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.be.null;
  });

  it("6. Given a schema with 100% nullable percentage, it should still return an array, ignoring the nullable property", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "array",
        options: {
          schema: {
            type: "boolean",
            isNullable: true,
            nullablePercentage: maxNullablePercentage,
          },
          min: 1,
          max: 1,
        },
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument.test).to.not.be.null;
    expect(resultDocument.test).to.be.a("array");
    expect(resultDocument.test).to.have.lengthOf(1);
  });
});
