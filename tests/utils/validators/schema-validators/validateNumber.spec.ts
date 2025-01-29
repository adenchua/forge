import { expect } from "chai";
import { describe, it } from "mocha";

import { validateNumber } from "../../../../src/utils/validators/schema-validators";
import InvalidReferenceKeyError from "../../../../src/errors/InvalidReferenceKeyError";

describe("Testing utility function: validateNumber", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateNumber({}, {});

    expect(response.isValid).to.be.true;
  });

  it("2. Given valid min only, it should return false", function () {
    const response = validateNumber({ min: 1 }, {});

    expect(response.isValid).to.be.false;
  });

  it("3. Given valid max, it should return false", function () {
    const response = validateNumber({ max: 1 }, {});

    expect(response.isValid).to.be.false;
  });

  it("4. Given valid references, it should return true", function () {
    const referenceString = "#ref.minMax";
    const response = validateNumber({ min: referenceString, max: referenceString }, { minMax: 1 });

    expect(response.isValid).to.be.true;
  });

  it("5. Given invalid references, it should throw invalid reference key error", function () {
    const referenceString = "#ref.minMax1";

    expect(() =>
      validateNumber({ min: referenceString, max: referenceString }, { minMax: 1 }),
    ).to.throw(InvalidReferenceKeyError);
  });

  it("6. Given non numeric min, it should return false", function () {
    const response = validateNumber({ min: "1" }, {});

    expect(response.isValid).to.be.false;
  });

  it("7. Given non numeric max, it should return false", function () {
    const response = validateNumber({ max: "1" }, {});

    expect(response.isValid).to.be.false;
  });

  it("8. Given min greater than max, it should return false", function () {
    const response = validateNumber({ min: 2, max: 1 }, {});

    expect(response.isValid).to.be.false;
  });
});
