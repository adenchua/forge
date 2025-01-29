import { expect } from "chai";
import { describe, it } from "mocha";

import { validateCopy } from "../../../../src/utils/validators/derivative-validators";
import InvalidReferenceKeyError from "../../../../src/errors/InvalidReferenceKeyError";

describe("Testing utility function: validateCopy", function () {
  it("1. Given an empty option, it should return false", function () {
    const emptyOption = {};
    const result = validateCopy(emptyOption, {});

    expect(result.isValid).to.be.false;
  });

  it("2. Given an invalid reference key, it should return false", function () {
    const invalidOptions = {
      referenceKey: "test2",
    };

    const result = validateCopy(invalidOptions, {
      test: {
        type: "boolean",
      },
    });

    expect(result.isValid).to.be.false;
  });

  it("3. Given a valid reference key, it should return true", function () {
    const validOptions = {
      referenceKey: "test2",
    };

    const result = validateCopy(validOptions, {
      test2: {
        type: "boolean",
      },
    });

    expect(result.isValid).to.be.true;
  });
});
