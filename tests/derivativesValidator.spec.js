import { expect } from "chai";
import { describe, it } from "mocha";

import { validateCopy } from "../src/utils/validators/derivative-validators/validateCopy.js";
import { validateRelativeDate } from "../src/utils/validators/derivative-validators/validateRelativeDate.js";
import { validateStringInterpolation } from "../src/utils/validators/derivative-validators/validateStringInterpolation.js";

describe("Testing utility function: validateCopy", function () {
  it("1. Given an 'null' option, it should return false", function () {
    const nullOptions = null;
    const result = validateCopy("test", nullOptions, {});

    expect(result).to.be.false;
  });

  it("2. Given an empty option, it should return false", function () {
    const emptyOption = {};
    const result = validateCopy("test", emptyOption, {});

    expect(result).to.be.false;
  });

  it("3. Given an invalid reference key, it should return false", function () {
    const invalidOptions = {
      referenceKey: "test2",
    };

    const result = validateCopy("test", invalidOptions, {
      test: {
        type: "boolean",
      },
    });

    expect(result).to.be.false;
  });

  it("4. Given a valid reference key, it should return true", function () {
    const validOptions = {
      referenceKey: "test2",
    };

    const result = validateCopy("test", validOptions, {
      test2: {
        type: "boolean",
      },
    });

    expect(result).to.be.true;
  });
});

describe("Testing utility function validateRelativeDate", function () {
  it("1. Given valid reference key and days option, it should return true", function () {
    const validOptions = {
      referenceKey: "key1",
      days: 1,
    };

    const result = validateRelativeDate("test", validOptions, { key1: { type: "boolean" } });

    expect(result).to.be.true;
  });

  it("2. Given missing referenceKey options, it should return false", function () {
    const optionsWithMissingReferenceKey = {
      days: 1,
    };

    const result = validateRelativeDate("test", optionsWithMissingReferenceKey, {
      key1: { type: "boolean" },
    });

    expect(result).to.be.false;
  });

  it("3. Given missing days options, it should return false", function () {
    const optionsWithMissingDays = {
      referenceKey: "key1",
    };

    const result = validateRelativeDate("test", optionsWithMissingDays, {
      key1: { type: "boolean" },
    });

    expect(result).to.be.false;
  });

  it("4. Given non numeric days option, it should return false", function () {
    const invalidOptions = {
      referenceKey: "key1",
      days: "1",
    };

    const result = validateRelativeDate("test", invalidOptions, {
      key1: { type: "boolean" },
    });

    expect(result).to.be.false;
  });

  it("5. Given invalid reference keys option, it should return false", function () {
    const invalidOptions = {
      referenceKey: "key2",
      days: 1,
    };

    const result = validateRelativeDate("test", invalidOptions, {
      key1: { type: "boolean" },
    });

    expect(result).to.be.false;
  });
});

describe("Testing utility function validateStringInterpolation", function () {
  it("1. Given valid options, it should return true", function () {
    const validOptions = {
      string: "{}-{}",
      referenceKeys: ["key1", "key2"],
    };

    const result = validateStringInterpolation("test", validOptions, {
      key1: {
        type: "boolean",
      },
      key2: {
        type: "boolean",
      },
    });

    expect(result).to.be.true;
  });

  it("2. Given missing string options, it should return false", function () {
    const missingStringOptions = {
      referenceKeys: ["key1", "key2"],
    };

    const result = validateStringInterpolation("test", missingStringOptions, {
      key1: {
        type: "boolean",
      },
      key2: {
        type: "boolean",
      },
    });

    expect(result).to.be.false;
  });

  it("3. Given missing referenceKeys options, it should return false", function () {
    const missingReferenceKeysOptions = {
      string: "{}-{}",
    };

    const result = validateStringInterpolation("test", missingReferenceKeysOptions, {
      key1: {
        type: "boolean",
      },
      key2: {
        type: "boolean",
      },
    });

    expect(result).to.be.false;
  });

  it("4. Given empty referenceKeys options, it should return false", function () {
    const emptyReferenceKeysOptions = {
      string: "{}-{}",
      referenceKeys: [],
    };

    const result = validateStringInterpolation("test", emptyReferenceKeysOptions, {
      key1: {
        type: "boolean",
      },
      key2: {
        type: "boolean",
      },
    });

    expect(result).to.be.false;
  });

  it("5. Given string number of '{}' not matching number of reference keys, it should return false", function () {
    const invalidOptions = {
      string: "{}-{}_{}",
      referenceKeys: ["key1", "key2"],
    };

    const result = validateStringInterpolation("test", invalidOptions, {
      key1: {
        type: "boolean",
      },
      key2: {
        type: "boolean",
      },
    });

    expect(result).to.be.false;
  });
});
