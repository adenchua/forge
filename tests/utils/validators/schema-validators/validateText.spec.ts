import { expect } from "chai";
import { describe, it } from "mocha";

import InvalidReferenceKeyError from "../../../../src/errors/InvalidReferenceKeyError";
import { validateText } from "../../../../src/utils/validators/schema-validators";

describe("Testing utility function: validateText", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateText({}, {});

    expect(response.isValid).to.be.true;
  });

  it("2. Given a valid min and max options, it should return true", function () {
    const validMin = 1;
    const validMax = 1;

    const response = validateText({ min: validMin, max: validMax }, {});

    expect(response.isValid).to.be.true;
  });

  it("3. Given valid reference options, it should return true", function () {
    const referenceString = "#ref.text";

    const response = validateText({ min: referenceString, max: referenceString }, { text: 1 });

    expect(response.isValid).to.be.true;
  });

  it("4. Given invalid reference options, it should throw InvalidReferenceKeyError", function () {
    const referenceString = "#ref.text2";
    const input = { min: referenceString, max: referenceString };

    expect(() => validateText(input, { text: 1 })).to.throw(InvalidReferenceKeyError);
  });

  it("5. Given a min and no max, it should return false", function () {
    const validMin = 1;

    const response = validateText({ min: validMin }, {});

    expect(response.isValid).to.be.false;
  });

  it("6. Given a max and no min, it should return false", function () {
    const validMax = 1;

    const response = validateText({ max: validMax }, {});

    expect(response.isValid).to.be.false;
  });

  it("7. Given non numeric min, it should return false", function () {
    const stringMin = "1";
    const validMax = 1;

    const response = validateText({ min: stringMin, max: validMax }, {});

    expect(response.isValid).to.be.false;
  });

  it("8. Given non numeric max, it should return false", function () {
    const validMin = 1;
    const stringMax = "1";

    const response = validateText({ min: validMin, max: stringMax }, {});

    expect(response.isValid).to.be.false;
  });
});
