import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Schema } from "../../../src/interfaces/schema";
import { Config } from "../../../src/interfaces/core";

describe("Testing gender type for DocumentFactory", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema: Schema = {
      test: {
        type: "gender",
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
    expect(["male", "female"]).to.include(resultDocument.test);
  });
});
