import { expect } from "chai";
import { describe, it } from "mocha";
import { differenceInCalendarDays } from "date-fns";

import DocumentFactory from "../../src/DocumentFactoryClass.js";

describe("Testing derivatives from DocumentFactoryClass", function () {
  it("1. Given a valid schema and a valid derivatives 'string-interpolation' type, it should return the correct response", function () {
    const schema = {
      field1: {
        type: "enum",
        options: ["one"],
      },
      field2: {
        type: "enum",
        options: ["two"],
      },
    };

    const derivatives = {
      combinedFields: {
        type: "string-interpolation",
        options: {
          string: "{}-{}",
          referenceKeys: ["field1", "field2"],
        },
      },
    };

    const documentFactory = new DocumentFactory(schema, 0, {}, derivatives);

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("combinedFields");
    expect(resultDocument.combinedFields).to.equal("one-two");
  });

  it("2. Given a valid schema and a valid derivatives 'copy' type, it should return the correct response", function () {
    const schema = {
      test: {
        type: "enum",
        options: ["one"],
      },
    };

    const derivatives = {
      copiedField: {
        type: "copy",
        options: {
          referenceKey: "test",
        },
      },
    };

    const documentFactory = new DocumentFactory(schema, 0, {}, derivatives);

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("copiedField");
    expect(resultDocument.copiedField).to.equal("one");
  });

  it("3. Given a valid schema and a valid derivatives 'date-before' type, it should return the correct response", function () {
    const schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: "2024-01-01",
          dateTo: "2024-01-01",
        },
      },
    };

    const derivatives = {
      dateField: {
        type: "date-before",
        options: {
          referenceKey: "test",
          days: 10,
        },
      },
    };

    const documentFactory = new DocumentFactory(schema, 0, {}, derivatives);

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("dateField");
    expect(resultDocument.dateField).to.be.a("string");

    expect(differenceInCalendarDays("2024-01-01", resultDocument.dateField))
      .to.be.lessThanOrEqual(10)
      .and.greaterThanOrEqual(0);
  });

  it("4. Given a valid schema and a valid derivatives 'date-after' type, it should return the correct response", function () {
    const schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: "2024-01-01",
          dateTo: "2024-01-01",
        },
      },
    };

    const derivatives = {
      dateField: {
        type: "date-after",
        options: {
          referenceKey: "test",
          days: 10,
        },
      },
    };

    const documentFactory = new DocumentFactory(schema, 0, {}, derivatives);

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("dateField");
    expect(resultDocument.dateField).to.be.a("string");
    expect(differenceInCalendarDays(resultDocument.dateField, "2024-01-01"))
      .to.be.lessThanOrEqual(10)
      .and.greaterThanOrEqual(0);
  });

  it("4. Given a valid schema and an invalid derivatives type, it should throw an error 'INVALID_DERIVATIVES_TYPE'", function () {
    const invalidDerivativeType = "hfff";
    const schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: "2024-01-01",
          dateTo: "2024-01-01",
        },
      },
    };

    const derivatives = {
      dateField: {
        type: invalidDerivativeType,
        options: {
          referenceKey: "test",
          days: 10,
        },
      },
    };

    expect(() => new DocumentFactory(schema, 0, {}, derivatives)).to.throw(
      "INVALID_DERIVATIVES_TYPE",
    );
  });
});
