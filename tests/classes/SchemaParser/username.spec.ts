import { expect } from "chai";
import { describe, it } from "mocha";

import DocumentFactory from "../../../src/classes/DocumentFactory";

describe("Testing username type for DocumentFactory", function () {
  it("1. Given no parameters, it should return the correct result document", function () {
    const schema = {
      test: {
        type: "username",
      },
    };
    const documentFactory = new DocumentFactory(schema, 0, {});

    const resultDocument = documentFactory.getDocument();

    expect(resultDocument).to.haveOwnProperty("test");
    expect(resultDocument.test).to.be.a("string");
  });
});
