import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

describe("Testing empty schema for SchemaParserClass", function () {
  it("1. Given an empty schema, the result document should be an empty object", function () {
    const emptySchema = {};
    const schemaParser = new SchemaParser(emptySchema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.be.eql({});
  });
});
