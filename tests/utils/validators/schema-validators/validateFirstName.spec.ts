import { expect } from "chai";
import { describe, it } from "mocha";

import { validateFirstName } from "../../../../src/utils/validators/schema-validators";
import { Gender } from "../../../../src/interfaces/schemaOptions";

describe("Testing utility function: validateFirstName", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateFirstName({});

    expect(response.isValid).to.be.true;
  });

  it("2. Given valid gender, it should return true", function () {
    const response = validateFirstName({ gender: "male" });

    expect(response.isValid).to.be.true;
  });

  it("3. Given an invalid gender, it should return false", function () {
    const invalidGender = "malee";
    const response = validateFirstName({ gender: invalidGender as unknown as Gender });

    expect(response.isValid).to.be.false;
  });
});
