import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

import { isValidUrl } from "../testUtils.js";
describe("Testing social-media-post type for SchemaParserClass", function () {
  it("1. Given a valid schema, it should return the correct response", function () {
    const schema = {
      test: {
        type: "social-media-post",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });

  it("2. Given a 100% nullable percentage, it should return the correct property with a null value", function () {
    const maxNullablePercentage = 1;
    const schema = {
      test: {
        type: "social-media-post",
        isNullable: true,
        nullablePercentage: maxNullablePercentage,
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.be.null;
  });

  it("3. Given a `null` languages option, it should throw an error 'LANGUAGES_MUST_NOT_BE_NULL'", function () {
    const schema = {
      test: {
        type: "social-media-post",
        options: {
          languages: null,
        },
      },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("LANGUAGES_MUST_NOT_BE_NULL");
  });

  it("4. Given an empty array languages option, it should throw an error 'LANGUAGES_MUST_NOT_BE_EMPTY'", function () {
    const schema = {
      test: {
        type: "social-media-post",
        options: {
          languages: [],
        },
      },
    };

    expect(() => new SchemaParser(schema, 0, {})).to.throw("LANGUAGES_MUST_NOT_BE_EMPTY");
  });

  it("5. Given a min and max of 1, it should return a result with one word", function () {
    const schema = {
      test: {
        type: "social-media-post",
        options: {
          min: 1,
          max: 1,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    const words = resultDocument.test.split(" ");

    expect(resultDocument.test).to.be.a("string");
    expect(words).to.have.lengthOf(1);
  });

  it("6. Given a 100% hashtag percentage, it should return a result with hashtags", function () {
    const maxHashtagPercentage = 1;
    const schema = {
      test: {
        type: "social-media-post",
        options: {
          hashtagPercentage: maxHashtagPercentage,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument.test).to.contain("#");
  });

  it("7. Given a 100% url percentage, it should return a result with a URL", function () {
    const maxUrlPercentage = 1;
    const schema = {
      test: {
        type: "social-media-post",
        options: {
          urlPercentage: maxUrlPercentage,
        },
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();
    const words = resultDocument.test.split(" ");
    // last word in the array is always a url
    const url = words[words.length - 1];

    expect(isValidUrl(url)).to.be.true;
  });
});
