import { expect } from "chai";
import { differenceInCalendarDays } from "date-fns";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";
import { Derivatives } from "../../../src/interfaces/derivatives";
import { Schema } from "../../../src/interfaces/schema";

describe("Testing derivatives from DocumentFactory", function () {
  it("1. Given a valid schema and a valid derivatives 'string-interpolation' type, it should return the correct response", function () {
    const schema: Schema = {
      field1: {
        type: "enum",
        options: ["one"],
      },
      field2: {
        type: "enum",
        options: ["two"],
      },
    };

    const derivatives: Derivatives = {
      combinedFields: {
        type: "string-interpolation",
        options: {
          pattern: "{}-{}",
          referenceKeys: ["field1", "field2"],
        },
      },
    };

    const config: Config = {
      recipe: {
        schema: schema,
        derivatives: derivatives,
      },
      globalNullablePercentage: 0,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("combinedFields");
    expect(resultDocument.combinedFields).to.equal("one-two");
  });

  it("2. Given a valid schema and a valid derivatives 'copy' type, it should return the correct response", function () {
    const schema: Schema = {
      test: {
        type: "enum",
        options: ["one"],
      },
    };

    const derivatives: Derivatives = {
      copiedField: {
        type: "copy",
        options: {
          referenceKey: "test",
        },
      },
    };

    const config: Config = {
      recipe: {
        schema: schema,
        derivatives: derivatives,
      },
      globalNullablePercentage: 0,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("copiedField");
    expect(resultDocument.copiedField).to.equal("one");
  });

  it("3. Given a valid schema and a valid derivatives 'date-before' type, it should return the correct response", function () {
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: "2024-01-01",
          dateTo: "2024-01-01",
        },
      },
    };

    const derivatives: Derivatives = {
      dateField: {
        type: "date-before",
        options: {
          referenceKey: "test",
          days: 10,
        },
      },
    };

    const config: Config = {
      recipe: {
        schema: schema,
        derivatives: derivatives,
      },
      globalNullablePercentage: 0,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("dateField");
    expect(resultDocument.dateField).to.be.a("string");

    expect(differenceInCalendarDays("2024-01-01", resultDocument.dateField))
      .to.be.lessThanOrEqual(10)
      .and.greaterThanOrEqual(0);
  });

  it("4. Given a valid schema and a valid derivatives 'date-after' type, it should return the correct response", function () {
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: "2024-01-01",
          dateTo: "2024-01-01",
        },
      },
    };

    const derivatives: Derivatives = {
      dateField: {
        type: "date-after",
        options: {
          referenceKey: "test",
          days: 10,
        },
      },
    };

    const config: Config = {
      recipe: {
        schema: schema,
        derivatives: derivatives,
      },
      globalNullablePercentage: 0,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("dateField");
    expect(resultDocument.dateField).to.be.a("string");
    expect(differenceInCalendarDays(resultDocument.dateField, "2024-01-01"))
      .to.be.lessThanOrEqual(10)
      .and.greaterThanOrEqual(0);
  });

  it("4. Given a valid schema and an invalid derivatives type, it should throw an error 'INVALID_DERIVATIVES_TYPE'", function () {
    const invalidDerivativeType = "hfff";
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: "2024-01-01",
          dateTo: "2024-01-01",
        },
      },
    };

    const derivatives: Derivatives = {
      dateField: {
        type: invalidDerivativeType,
        options: {
          referenceKey: "test",
          days: 10,
        },
      },
    } as unknown as Derivatives;

    const config: Config = {
      recipe: {
        schema: schema,
        derivatives: derivatives,
      },
      globalNullablePercentage: 0,
    };

    expect(() => new DocumentFactory(config).generateDocument()).to.throw(
      "invalid derivatives type",
    );
  });

  it("5. Given a nested derivative, it should produce the correct result document", function () {
    const schema: Schema = {
      test: {
        type: "object",
        options: {
          properties: {
            nestedA: {
              type: "object",
              options: {
                properties: {
                  nestedAB: {
                    type: "enum",
                    options: ["one"],
                  },
                },
              },
            },
          },
        },
      },
      test2: {
        type: "enum",
        options: ["two"],
      },
    };

    const derivatives: Derivatives = {
      "test.nestedA.nestedAC": {
        type: "copy",
        options: {
          referenceKey: "test2",
        },
      },
    };

    const config: Config = {
      recipe: {
        schema: schema,
        derivatives: derivatives,
      },
      globalNullablePercentage: 0,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.eql({
      test: {
        nestedA: {
          nestedAB: "one",
          nestedAC: "two",
        },
      },
      test2: "two",
    });
  });

  it("6. Given a valid nested referenced key, it should produce the correct result document", function () {
    const schema: Schema = {
      test: {
        type: "object",
        options: {
          properties: {
            nestedA: {
              type: "object",
              options: {
                properties: {
                  nestedAB: {
                    type: "enum",
                    options: ["one"],
                  },
                },
              },
            },
          },
        },
      },
      test2: {
        type: "enum",
        options: ["two"],
      },
    };

    const derivatives: Derivatives = {
      "test.nestedA.nestedAC": {
        type: "copy",
        options: {
          referenceKey: "test.nestedA.nestedAB",
        },
      },
    };

    const config: Config = {
      recipe: {
        schema: schema,
        derivatives: derivatives,
      },
      globalNullablePercentage: 0,
    };

    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.eql({
      test: {
        nestedA: {
          nestedAB: "one",
          nestedAC: "one",
        },
      },
      test2: "two",
    });
  });
});
