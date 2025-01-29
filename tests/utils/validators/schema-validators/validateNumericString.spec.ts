import { expect } from "chai";
import { describe, it } from "mocha";

import { validateNumericString } from "../../../../src/utils/validators/schema-validators";
import InvalidReferenceKeyError from "../../../../src/errors/InvalidReferenceKeyError";

describe("Testing utility function: validateNumericString", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateNumericString({}, {});

    expect(response.isValid).to.be.true;
  });

  it("2. Given a valid min, max and allowLeadingZeros, it should return true", function () {
    const validMinMax = 1;
    const allowLeadingZeros = true;
    const response = validateNumericString(
      { min: validMinMax, max: validMinMax, allowLeadingZeros },
      {},
    );

    expect(response.isValid).to.be.true;
  });

  it("3. Given a min and no max, it should return false", function () {
    const validMin = 1;
    const response = validateNumericString({ min: validMin }, {});

    expect(response.isValid).to.be.false;
  });

  it("4. Given a max and no min, it should return false", function () {
    const validMax = 1;
    const response = validateNumericString({ max: validMax }, {});

    expect(response.isValid).to.be.false;
  });

  it("5. Given valid reference key for min and max, it should return true", function () {
    const referenceString = "#ref.minMax";
    const response = validateNumericString(
      { min: referenceString, max: referenceString },
      { minMax: 1 },
    );

    expect(response.isValid).to.be.true;
  });

  it("6. Given invalid reference key for min and max, it should throw InvalidReferenceKeyError", function () {
    const referenceString = "#ref.minMax1";

    expect(() =>
      validateNumericString({ min: referenceString, max: referenceString }, { minMax: 1 }),
    ).to.throw(InvalidReferenceKeyError);
  });

  it("7. Given a non-boolean allowLeadingZeros, it should return false", function () {
    const allowLeadingZeros = "true" as unknown as boolean;
    const response = validateNumericString({ allowLeadingZeros }, {});

    expect(response.isValid).to.be.false;
  });

  it("8. Given a non-numeric min, it should return false", function () {
    const stringMin = "1";
    const response = validateNumericString({ min: stringMin, max: 1 }, {});

    expect(response.isValid).to.be.false;
  });

  it("9. Given a non-numeric max, it should return false", function () {
    const stringMax = "1";
    const response = validateNumericString({ min: 1, max: stringMax }, {});

    expect(response.isValid).to.be.false;
  });

  it("10. Given a min greater than max, it should return false", function () {
    const min = 1;
    const max = 0;
    const response = validateNumericString({ min, max }, {});

    expect(response.isValid).to.be.false;
  });
});
