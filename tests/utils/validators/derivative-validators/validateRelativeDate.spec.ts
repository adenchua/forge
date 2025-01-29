import { expect } from "chai";
import { describe, it } from "mocha";

import { validateRelativeDate } from "../../../../src/utils/validators/derivative-validators";
import InvalidReferenceKeyError from "../../../../src/errors/InvalidReferenceKeyError";

describe("Testing utility function validateRelativeDate", function () {
  it("1. Given valid reference key and days option, it should return true", function () {
    const validOptions = {
      referenceKey: "key1",
      days: 1,
    };

    const result = validateRelativeDate(validOptions, { key1: { type: "boolean" } });

    expect(result.isValid).to.be.true;
  });

  it("2. Given missing referenceKey options, it should return false", function () {
    const optionsWithMissingReferenceKey = {
      days: 1,
    };

    const result = validateRelativeDate(optionsWithMissingReferenceKey, {
      key1: { type: "boolean" },
    });

    expect(result.isValid).to.be.false;
  });

  it("3. Given missing days options, it should return false", function () {
    const optionsWithMissingDays = {
      referenceKey: "key1",
    };

    const result = validateRelativeDate(optionsWithMissingDays, {
      key1: { type: "boolean" },
    });

    expect(result.isValid).to.be.false;
  });

  it("4. Given non numeric days option, it should return false", function () {
    const invalidOptions = {
      referenceKey: "key1",
      days: "1" as unknown as number,
    };

    const result = validateRelativeDate(invalidOptions, {
      key1: { type: "boolean" },
    });

    expect(result.isValid).to.be.false;
  });

  it("5. Given invalid reference keys option, it should return false", function () {
    const invalidOptions = {
      referenceKey: "key2",
      days: 1,
    };

    const result = validateRelativeDate(invalidOptions, {
      key1: { type: "boolean" },
    });

    expect(result.isValid).to.be.false;
  });
});
