import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { isValidUrl } from "../../testUtils";
import { Schema } from "../../../src/interfaces/schema";
import { Config } from "../../../src/interfaces/core";

describe("Testing social-media-post type for DocumentFactory", function () {
  it("1. Given a valid schema, it should return the correct response", function () {
    const schema: Schema = {
      test: {
        type: "social-media-post",
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
  });

  it("2. Given a 100% nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema: Schema = {
      test: {
        type: "social-media-post",
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

  it("3. Given a `null` languages option, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const schema: Schema = {
      test: {
        type: "social-media-post",
        options: {
          languages: null,
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
      "ENUM_OPTIONS_MUST_NOT_BE_EMPTY",
    );
  });

  it("4. Given an empty array languages option, it should throw an error 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY'", function () {
    const schema: Schema = {
      test: {
        type: "social-media-post",
        options: {
          languages: [],
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
      "ENUM_OPTIONS_MUST_NOT_BE_EMPTY",
    );
  });

  it("5. Given a min and max of 1, it should return a result with one word", function () {
    const schema: Schema = {
      test: {
        type: "social-media-post",
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
    const words = resultDocument.test.split(" ");

    expect(resultDocument.test).to.be.a("string");
    expect(words).to.have.lengthOf(1);
  });

  it("6. Given a 100% hashtag percentage, it should return a result with hashtags", function () {
    const maxHashtagPercentage = 1;
    const schema: Schema = {
      test: {
        type: "social-media-post",
        options: {
          hashtagPercentage: maxHashtagPercentage,
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

    expect(resultDocument.test).to.contain("#");
  });

  it("7. Given a 100% url percentage, it should return a result with a URL", function () {
    const maxUrlPercentage = 1;
    const schema: Schema = {
      test: {
        type: "social-media-post",
        options: {
          urlPercentage: maxUrlPercentage,
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
    const words = resultDocument.test.split(" ");
    // last word in the array is always a url
    const url = words[words.length - 1];

    expect(isValidUrl(url)).to.be.true;
  });
});
