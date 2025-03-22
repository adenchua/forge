import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";
import { Config } from "../../../src/interfaces/core";
import { Schema } from "../../../src/interfaces/schema";

describe("Testing empty schema for DocumentFactory", function () {
  it("1. Given an empty schema, the result document should be an empty object", function () {
    const emptySchema: Schema = {};
    const config: Config = { recipe: { schema: emptySchema }, globalNullablePercentage: 0 };
    const documentFactory = new DocumentFactory(config);

    documentFactory.generateDocument();
    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.be.eql({});
  });
});
