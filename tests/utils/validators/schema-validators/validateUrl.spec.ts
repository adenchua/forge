import { expect } from "chai";
import { describe, it } from "mocha";

import { validateUrl } from "../../../../src/utils/validators/schema-validators";

describe("Testing utility function: validateUrl", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateUrl({});

    expect(response.isValid).to.be.true;
  });

  it("2. Given a valid allowNumbers option, it should return true", function () {
    const response = validateUrl({ allowNumbers: true });

    expect(response.isValid).to.be.true;
  });

  it("3. Given a string allowNumbers option, it should return false", function () {
    const response = validateUrl({ allowNumbers: "true" as unknown as boolean });

    expect(response.isValid).to.be.false;
  });
});
