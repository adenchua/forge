import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";
import { Schema } from "../../../src/interfaces/schema";
import { isValidEmail } from "../../testUtils";

describe("Testing email type for DocumentFactory", function () {
  it("1. Given a valid schema, it should return the correct response", function () {
    const schema: Schema = {
      test: {
        type: "email",
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
    expect(resultDocument.test).to.be.a("string");
    expect(isValidEmail(resultDocument.test)).to.be.true;
  });

  it("2. Given a 100% nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema: Schema = {
      test: {
        type: "email",
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
});
