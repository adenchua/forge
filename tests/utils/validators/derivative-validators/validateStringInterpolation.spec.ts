import { expect } from "chai";
import { describe, it } from "mocha";

import { validateStringInterpolation } from "../../../../src/utils/validators/derivative-validators";
import { StringInterpolationOptions } from "../../../../src/interfaces/derivativesOptions";

describe("Testing utility function validateStringInterpolation", function () {
  it("1. Given valid options, it should return true", function () {
    const validOptions = {
      pattern: "{}-{}",
      referenceKeys: ["key1", "key2"],
    };

    const result = validateStringInterpolation(validOptions, {
      key1: {
        type: "boolean",
      },
      key2: {
        type: "boolean",
      },
    });

    expect(result.isValid).to.be.true;
  });

  it("2. Given missing string options, it should return false", function () {
    const missingStringOptions = {
      referenceKeys: ["key1", "key2"],
    };

    const result = validateStringInterpolation(missingStringOptions, {
      key1: {
        type: "boolean",
      },
      key2: {
        type: "boolean",
      },
    });

    expect(result.isValid).to.be.false;
  });

  it("3. Given missing referenceKeys options, it should return false", function () {
    const missingReferenceKeysOptions = {
      string: "{}-{}",
    };

    const result = validateStringInterpolation(
      missingReferenceKeysOptions as unknown as StringInterpolationOptions,
      {
        key1: {
          type: "boolean",
        },
        key2: {
          type: "boolean",
        },
      },
    );

    expect(result.isValid).to.be.false;
  });

  it("4. Given empty referenceKeys options, it should return false", function () {
    const emptyReferenceKeysOptions = {
      string: "{}-{}",
      referenceKeys: [],
    };

    const result = validateStringInterpolation(emptyReferenceKeysOptions, {
      key1: {
        type: "boolean",
      },
      key2: {
        type: "boolean",
      },
    });

    expect(result.isValid).to.be.false;
  });

  it("5. Given string number of '{}' not matching number of reference keys, it should return false", function () {
    const invalidOptions = {
      string: "{}-{}_{}",
      referenceKeys: ["key1", "key2"],
    };

    const result = validateStringInterpolation(invalidOptions, {
      key1: {
        type: "boolean",
      },
      key2: {
        type: "boolean",
      },
    });

    expect(result.isValid).to.be.false;
  });
});
