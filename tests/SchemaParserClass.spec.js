import { it } from "mocha";
import { expect } from "chai";
import { isBefore, isValid } from "date-fns";

import SchemaParser from "../src/SchemaParserClass.js";

describe("Testing empty schema for SchemaParserClass", function () {
  it("1. Given an empty schema, the result document should be an empty object", function () {
    const emptySchema = {};
    const schemaParser = new SchemaParser(emptySchema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.be.eql({});
  });
});

describe("Testing boolean type for SchemaParserClass", function () {
  it("1. Given a schema with boolean type, the result document should have the boolean property", function () {
    const schemaWithBoolean = {
      test: {
        type: "boolean",
      },
    };
    const schemaParser = new SchemaParser(schemaWithBoolean, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("boolean");
  });

  it("2. Given 100% nullable percentage, the result document should have the property with null", function () {
    const maximumNullablePercentage = 1;
    const schemaWithBoolean = {
      test: {
        type: "boolean",
        isNullable: true,
        nullablePercentage: maximumNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schemaWithBoolean, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing enum type for SchemaParserClass", function () {
  it("1. Given a schema with enum type with a valid options array, the result document should have the enum property", function () {
    const validOptions = ["apple", "banana", "pear"];
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: validOptions,
      },
    };
    const schemaParser = new SchemaParser(schemaWithEnum, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(validOptions).to.include(resultDocument.test);
  });

  it("2. Given a schema with enum type with an invalid empty options array, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const emptyOptions = [];
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: emptyOptions,
      },
    };

    expect(() => new SchemaParser(schemaWithEnum, 0, {})).to.throw(
      "ENUM_OPTIONS_MUST_NOT_BE_EMPTY",
    );
  });

  it("3. Given a schema with enum type with an invalid null option, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_NULL'", function () {
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: null,
      },
    };

    expect(() => new SchemaParser(schemaWithEnum, 0, {})).to.throw("ENUM_OPTIONS_MUST_NOT_BE_NULL");
  });

  it("4. Given a schema with enum type with a valid referenced options, the result document should have the enum property", function () {
    const references = { sampleArray: ["apple"] };
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: "#ref.sampleArray",
      },
    };
    const schemaParser = new SchemaParser(schemaWithEnum, 0, references);

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.equal("apple");
  });

  it("5. Given a schema with enum type with invalid referenced options, the result document should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const referenceWithEmptyArray = { sampleArray: [] };
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: "#ref.sampleArray",
      },
    };

    expect(() => new SchemaParser(schemaWithEnum, 0, referenceWithEmptyArray)).to.throw(
      "ENUM_OPTIONS_MUST_NOT_BE_EMPTY",
    );
  });

  it("6. Given a schema with enum type with non existing referenced options, the result document should throw an error 'REFERENCE_KEY_DOES_NOT_EXIST'", function () {
    const emptyReference = {};
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: "#ref.sampleArray",
      },
    };

    expect(() => new SchemaParser(schemaWithEnum, 0, emptyReference)).to.throw(
      "REFERENCE_KEY_DOES_NOT_EXIST",
    );
  });

  it("7. Given a 100% chance of nullablePercentage, the result document should have the correct enum property with null value", function () {
    const validOptions = ["apple"];
    const maxNullablePercentage = 1;
    const schemaWithEnum = {
      test: {
        type: "enum",
        options: validOptions,
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schemaWithEnum, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing enum-array type for SchemaParserClass", function () {
  it("1. Given a valid options array, it should return the correct response", function () {
    const validOptions = ["apple"];
    const schema = {
      test: { type: "enum-array", options: validOptions },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("array");
  });

  it("2. Given a empty options array, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const emptyArray = [];
    const schema = {
      test: { type: "enum-array", options: emptyArray },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("ENUM_OPTIONS_MUST_NOT_BE_EMPTY");
  });

  it("3. Given a null options array, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_NULL", function () {
    const schema = {
      test: { type: "enum-array", options: null },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("ENUM_OPTIONS_MUST_NOT_BE_NULL");
  });

  it("4. Given a valid referenced array, it should return the correct response", function () {
    const referenceWithValidArray = { sampleArray: ["apple"] };
    const schema = {
      test: {
        type: "enum-array",
        options: "#ref.sampleArray",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, referenceWithValidArray);

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("array");
  });

  it("5. Given an non existing referenced key, it should throw an error 'REFERENCE_KEY_DOES_NOT_EXIST'", function () {
    const reference = {};
    const schema = {
      test: {
        type: "enum-array",
        options: "#ref.sampleArray",
      },
    };

    expect(() => new SchemaParser(schema, 0, reference)).to.throw("REFERENCE_KEY_DOES_NOT_EXIST");
  });

  it("6. Given a 100% nullablePercentage, it should return the correct property with null value", function () {
    const maximumNullablePercentage = 1;
    const schema = {
      test: {
        type: "enum-array",
        options: ["apple"],
        isNullable: true,
        nullablePercentage: maximumNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing iso-timestamp type for SchemaParserClass", function () {
  it("1. Given a valid iso-timestamp schema, it should return the correct result", function () {
    const schema = { test: { type: "iso-timestamp" } };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(isValid(new Date(resultDocument.test))).to.be.true;
    expect(isBefore(new Date(resultDocument.test), new Date())).to.be.true;
  });

  it("2. Given a valid 'dateFrom' option and an null 'dateTo' option, it should throw 'INVALID_DATE_RANGE' error", function () {
    const validDateFrom = "2000-01-01";
    const schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: validDateFrom,
          dateTo: null,
        },
      },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("INVALID_DATE_RANGE");
  });

  it("3. Given a null 'dateFrom' option and an valid 'dateTo' option, it should throw 'INVALID_DATE_RANGE' error", function () {
    const validDateTo = "2000-01-01";
    const schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: null,
          dateTo: validDateTo,
        },
      },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("INVALID_DATE_RANGE");
  });

  it("4. Given a null 'datefrom' and a null 'dateTo' option, it should return the correct result", function () {
    const schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: null,
          dateTo: null,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(isValid(new Date(resultDocument.test))).to.be.true;
    expect(isBefore(new Date(resultDocument.test), new Date())).to.be.true;
  });

  it("5. Given a valid 'dateFrom' and a valid 'dateTo' option, it should return the correct date between the two dates", function () {
    const validDate = "2001-01-01T00:00:00.000Z";
    const schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: validDate,
          dateTo: validDate,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(isValid(new Date(resultDocument.test))).to.be.true;
    expect(resultDocument.test).to.equal("2001-01-01T00:00:00.000Z");
  });

  it("6. Given a 100% null percentage, it should return the correct key with a null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "iso-timestamp",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing delimited-string type for SchemaParserClass", function () {});
