import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Schema } from "../../../src/interfaces/schema";
import { Config } from "../../../src/interfaces/core";

describe("Testing number type for DocumentFactory", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema: Schema = {
      test: {
        type: "number",
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
    expect(resultDocument.test).to.be.a("number");
  });

  it("2. Given a min and max option of 1, it should return 1", function () {
    const schema: Schema = {
      test: {
        type: "number",
        options: {
          min: 1,
          max: 1,
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

    expect(resultDocument.test).to.equal(1);
  });

  it("3. Given a null min and max option, it should return the correct result document", function () {
    const schema: Schema = {
      test: {
        type: "number",
        options: {
          min: null,
          max: null,
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

    expect(resultDocument.test).to.be.a("number");
  });

  it("4. Given a max nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema: Schema = {
      test: {
        type: "number",
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

  it("5. Given a valid reference 'min' and 'max' option, it should return the correct value", function () {
    const reference = {
      key1: 1,
      key2: 1,
    };
    const schema: Schema = {
      test: {
        type: "number",
        options: {
          min: "#ref.key1",
          max: "#ref.key2",
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

    expect(resultDocument.test).to.equal(1);
  });

  it("6. Given a invalid reference 'min' and 'max' option, it should throw an error 'invalid reference key'", function () {
    const schema: Schema = {
      test: {
        type: "number",
        options: {
          min: "#ref.key1",
          max: "#ref.key2",
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
