import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../src/classes/DocumentFactory";

describe("Testing empty schema for DocumentFactoryClass", function () {
  it("1. Given an empty schema, the result document should be an empty object", function () {
    const emptySchema = {};
    const documentFactory = new DocumentFactory(emptySchema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.be.eql({});
  });
});
