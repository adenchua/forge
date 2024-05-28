import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

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
