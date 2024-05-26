import { expect } from "chai";
import { isBefore, isValid } from "date-fns";
import { it } from "mocha";

import SchemaParser from "../src/SchemaParserClass.js";
import { isValidUrl } from "./testUtils.js";

describe("Testing empty schema for SchemaParserClass", function () {
  it("1. Given an empty schema, the result document should be an empty object", function () {
    const emptySchema = {};
    const schemaParser = new SchemaParser(emptySchema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.be.eql({});
  });
});

describe("Testing boolean type for SchemaParserClass", function () {
  it("1. Given a schema Given boolean type, the result document should have the boolean property", function () {
    const schemaGivenBoolean = {
      test: {
        type: "boolean",
      },
    };
    const schemaParser = new SchemaParser(schemaGivenBoolean, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("boolean");
  });

  it("2. Given 100% nullable percentage, the result document should have the property Given null", function () {
    const maxNullablePercentage = 1;
    const schemaGivenBoolean = {
      test: {
        type: "boolean",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schemaGivenBoolean, 0, {});

    const resultDocument = schemaParser.getDocument();

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
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "enum-array",
        options: ["apple"],
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

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

    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing object type for SchemaParserClass", function () {
  it("1. Given a schema with two object properties, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "object",
        options: {
          properties: [
            {
              fieldName: "field1",
              type: "boolean",
            },
            {
              fieldName: "field2",
              type: "boolean",
            },
          ],
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.haveOwnProperty("field1");
    expect(resultDocument.test.field1).to.be.a("boolean");
    expect(resultDocument.test).to.haveOwnProperty("field2");
    expect(resultDocument.test.field2).to.be.a("boolean");
  });

  it("2. Given a schema with nested object property, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "object",
        options: {
          properties: [
            {
              fieldName: "field1",
              type: "object",
              options: {
                properties: [
                  {
                    fieldName: "nestedField1",
                    type: "boolean",
                  },
                ],
              },
            },
          ],
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.haveOwnProperty("field1");
    expect(resultDocument.test.field1).to.haveOwnProperty("nestedField1");
    expect(resultDocument.test.field1.nestedField1).to.be.a("boolean");
  });

  it("3. Given a schema with object property with 100% null, it should return the correct result document", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "object",
        options: {
          properties: [
            {
              fieldName: "field1",
              type: "boolean",
              isNullable: true,
              nullablePercentage: maxNullablePercentage,
            },
          ],
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.haveOwnProperty("field1");
    expect(resultDocument.test.field1).to.be.null;
  });

  it("4. Given a 100% nullable percentage, it should return a property with null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "object",
        options: {
          properties: [
            {
              fieldName: "field1",
              type: "boolean",
            },
          ],
        },
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing text type for SchemaParserClass", function () {
  it("1. Given no parameters with type text, it should return the correct result document with minimum of 5 words and maximum of 120 words", function () {
    const schema = {
      test: { type: "text" },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    const words = resultDocument.test?.split(" ");

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(words).to.have.length.greaterThanOrEqual(5).and.lessThanOrEqual(120);
  });

  it("2. Given a min and max of 1 with type text, it should return the correct result document with 1 word", function () {
    const schema = {
      test: {
        type: "text",
        options: {
          min: 1,
          max: 1,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    const words = resultDocument.test?.split(" ");

    expect(words).to.have.lengthOf(1);
  });

  it("3. Given null parameters for min and max, it should return the correct result document with minimum of 5 words and maximum of 120 words", function () {
    const schema = {
      test: {
        type: "text",
        options: {
          min: null,
          max: null,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    const words = resultDocument.test?.split(" ");

    expect(words).to.have.length.greaterThanOrEqual(5).and.lessThanOrEqual(120);
  });

  it("4. Given maximum nullablePercentage, it should return a property with a value null", function () {
    const maxNullablePercentage = 1;
    const schema = {
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
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing numeric-string for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document with length 1 numeric string", function () {
    const schema = {
      test: {
        type: "numeric-string",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

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
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

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
      const schemaParser = new SchemaParser(schema, 0, {});
      const resultDocument = schemaParser.getDocument();

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
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing url type for SchemaParserClass", function () {
  it("1. Given no parameters, it should generate the correct result document", function () {
    const schema = {
      test: {
        type: "url",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(isValidUrl(resultDocument.test)).to.be.true;
  });

  it("2. Given allowsNumbers parameter, it should generate the correct result document", function () {
    const schema = {
      test: {
        type: "url",
        options: {
          allowNumbers: true,
        },
      },
    };
    let consistOfNumbers = false;
    const sampleSize = 100;
    const regExpMatchAnyDigits = /\/\d+/;

    for (let i = 0; i < sampleSize; i++) {
      const schemaParser = new SchemaParser(schema, 0, {});
      const resultDocument = schemaParser.getDocument();
      if (!!resultDocument.test.match(regExpMatchAnyDigits)) {
        consistOfNumbers = true;
        break;
      }
    }

    expect(consistOfNumbers).to.be.true;
  });

  it("3. Given max nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "url",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing array type for SchemaParserClass", function () {
  it("1. Given no parameters, it should throw an error 'ARRAY_SCHEMA_NOT_PROVIDED'", function () {
    const schema = {
      test: {
        type: "array",
      },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("ARRAY_SCHEMA_NOT_PROVIDED");
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
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

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
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

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

    expect(() => new SchemaParser(schema, 0, {})).to.throw("MIN_MAX_OPTIONS_MUST_BE_A_NUMBER");
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
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

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
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.not.be.null;
    expect(resultDocument.test).to.be.a("array");
    expect(resultDocument.test).to.have.lengthOf(1);
  });
});

describe("Testing number type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "number",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("number");
  });

  it("2. Given a min and max option of 1, it should return 1", function () {
    const schema = {
      test: {
        type: "number",
        options: {
          min: 1,
          max: 1,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.equal(1);
  });

  it("3. Given a null min and max option, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "number",
        options: {
          min: null,
          max: null,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.a("number");
  });

  it("4. Given a max nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "number",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    expect(resultDocument.test).to.be.null;
  });
});

describe("Testing float type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct property with a float value", function () {
    const schema = {
      test: {
        type: "float",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

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
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.equal(1.0);
  });
});

describe("Testing username type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "username",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});

describe("Testing gender type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "gender",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
    expect(["male", "female"]).to.include(resultDocument.test);
  });
});

describe("Testing user bio type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "user-bio",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});

describe("Testing first name type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "first-name",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });

  it("2. Given a invalid gender, it should throw an error 'INVALID_GENDER_PROVIDED'", function () {
    const invalidGender = "";
    const schema = {
      test: {
        type: "first-name",
        options: {
          gender: invalidGender,
        },
      },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("INVALID_GENDER_PROVIDED");
  });

  it("3. Given a valid gender, it should return the correct result document", function () {
    const validGender = "male";
    const schema = {
      test: {
        type: "first-name",
        options: {
          gender: validGender,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});

describe("Testing last name type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "last-name",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

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

    expect(() => new SchemaParser(schema, 0, {})).to.throw("INVALID_GENDER_PROVIDED");
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
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});

describe("Testing full name type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "full-name",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });

  it("2. Given a invalid gender, it should throw an error 'INVALID_GENDER_PROVIDED'", function () {
    const invalidGender = "";
    const schema = {
      test: {
        type: "full-name",
        options: {
          gender: invalidGender,
        },
      },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("INVALID_GENDER_PROVIDED");
  });

  it("3. Given a valid gender, it should return the correct result document", function () {
    const validGender = "male";
    const schema = {
      test: {
        type: "full-name",
        options: {
          gender: validGender,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});
