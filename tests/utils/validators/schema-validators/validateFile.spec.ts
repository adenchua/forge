import { expect } from "chai";
import { describe, it } from "mocha";

import { validateFile } from "../../../../src/utils/validators/schema-validators";

describe("Testing utility function: validateFile", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateFile({});

    expect(response.isValid).to.be.true;
  });

  it("2. Given a valid extension, it should return true", function () {
    const response = validateFile({ extension: "jpg" });

    expect(response.isValid).to.be.true;
  });

  it("3. Given a non-string extension, it should return false", function () {
    const response = validateFile({ extension: 1 as unknown as string });

    expect(response.isValid).to.be.false;
  });
});
