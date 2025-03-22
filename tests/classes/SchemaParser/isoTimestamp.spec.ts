import { expect } from "chai";
import { isBefore, isValid } from "date-fns";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Schema } from "../../../src/interfaces/schema";
import { Config } from "../../../src/interfaces/core";

describe("Testing iso-timestamp type for DocumentFactory", function () {
  it("1. Given a valid iso-timestamp schema, it should return the correct result", function () {
    const schema: Schema = { test: { type: "iso-timestamp" } };
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
    expect(isValid(new Date(resultDocument.test))).to.be.true;
    expect(isBefore(new Date(resultDocument.test), new Date())).to.be.true;
  });

  it("2. Given a valid 'dateFrom' option and an null 'dateTo' option, it should throw 'invalid date range provided' error", function () {
    const validDateFrom = "2000-01-01";
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: validDateFrom,
          dateTo: null,
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
      "invalid date range provided",
    );
  });

  it("3. Given a null 'dateFrom' option and an valid 'dateTo' option, it should throw 'invalid date range provided' error", function () {
    const validDateTo = "2000-01-01";
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: null,
          dateTo: validDateTo,
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
      "invalid date range provided",
    );
  });

  it("4. Given a null 'datefrom' and a null 'dateTo' option, it should return the correct result", function () {
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: null,
          dateTo: null,
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

    expect(isValid(new Date(resultDocument.test))).to.be.true;
    expect(isBefore(new Date(resultDocument.test), new Date())).to.be.true;
  });

  it("5. Given a valid 'dateFrom' and a valid 'dateTo' option, it should return the correct date between the two dates", function () {
    const validDate = "2001-01-01T00:00:00.000Z";
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: validDate,
          dateTo: validDate,
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

    expect(isValid(new Date(resultDocument.test))).to.be.true;
    expect(resultDocument.test).to.equal("2001-01-01T00:00:00.000Z");
  });

  it("6. Given a 100% null percentage, it should return the correct key with a null value", function () {
    const maxNullablePercentage = 1;
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
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

    expect(resultDocument.test).to.be.null;
  });

  it("7. Given a valid reference 'dateFrom' and 'dateTo' option, it should return the correct date", function () {
    const validDate = "2001-01-01T00:00:00.000Z";
    const reference = {
      date: validDate,
    };
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: "#ref.date",
          dateTo: "#ref.date",
        },
      },
    };
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
      references: reference,
    };
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();
    expect(resultDocument.test).to.equal("2001-01-01T00:00:00.000Z");
  });

  it("8. Given a invalid reference 'dateFrom' and 'dateTo' option, it should throw an error 'invalid reference key'", function () {
    const schema: Schema = {
      test: {
        type: "iso-timestamp",
        options: {
          dateFrom: "#ref.date",
          dateTo: "#ref.date",
        },
      },
    };
    const emptyReference = {};
    const config: Config = {
      recipe: {
        schema,
      },
      globalNullablePercentage: 0,
      references: emptyReference,
    };

    expect(() => new DocumentFactory(config).generateDocument()).to.throw("invalid reference key");
  });
});
