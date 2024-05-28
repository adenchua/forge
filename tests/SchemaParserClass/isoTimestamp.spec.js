import { expect } from "chai";
import { isBefore, isValid } from "date-fns";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

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
