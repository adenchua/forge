import { expect } from "chai";
import { describe, it } from "mocha";

import InvalidReferenceKeyError from "../../../../src/errors/InvalidReferenceKeyError";
import { validateEnum } from "../../../../src/utils/validators/schema-validators";

describe("Testing utility function: validateEnum", function () {
  it("1. Given a valid options, it should return true", function () {
    const validOptions = ["test"];
    const result = validateEnum(validOptions, {});

    expect(result.isValid).to.be.true;
  });

  it("2. Given an valid reference, it should return true", function () {
    const validReference = "#ref.array";
    const result = validateEnum(validReference, { array: ["test"] });

    expect(result.isValid).to.be.true;
  });

  it("3. Given an invalid empty options, it should return false", function () {
    const invalidEmptyArray = [];
    const result = validateEnum(invalidEmptyArray, {});

    expect(result.isValid).to.be.false;
  });

  it("4. Given an invalid reference, it should throw InvalidReferenceKeyError", function () {
    const invalidReference = "#ref.array2";

    expect(() => validateEnum(invalidReference, { array: ["test"] })).to.throw(
      InvalidReferenceKeyError,
    );
  });
});
