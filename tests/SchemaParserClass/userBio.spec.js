import { expect } from "chai";
import { it } from "mocha";

import SchemaParser from "../../src/SchemaParserClass.js";

describe("Testing user bio type for SchemaParserClass", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "user-bio",
      },
    };
    const schemaParser = new SchemaParser(schema, 0, {});

    const resultDocument = schemaParser.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});
