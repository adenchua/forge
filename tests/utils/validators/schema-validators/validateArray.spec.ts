import { expect } from "chai";
import { describe, it } from "mocha";

import { validateArray } from "../../../../src/utils/validators/schema-validators";
import { SchemaValue } from "../../../../src/interfaces/schema";

describe("Testing utility function: validateArray", function () {
  it("1. Given a valid min, max and schema, it should return true", function () {
    const validInput = {
      min: 0,
      max: 0,
      schema: { type: "iso-timestamp" } as SchemaValue,
    };

    const response = validateArray(validInput);

    expect(response.isValid).to.be.true;
  });

  it("2. Given no options, it should return false", function () {
    const response = validateArray({});

    expect(response.isValid).to.be.false;
  });

  it("3. Given non-numeric min, it should return false", function () {
    const nonNumericMinInput = {
      min: "0" as unknown as number,
      max: 0,
      schema: { type: "iso-timestamp" } as SchemaValue,
    };

    const response = validateArray(nonNumericMinInput);

    expect(response.isValid).to.be.false;
  });

  it("4. Given non-numeric max, it should return false", function () {
    const nonNumericMaxInput = {
      min: 0,
      max: "0" as unknown as number,
      schema: { type: "iso-timestamp" } as SchemaValue,
    };

    const response = validateArray(nonNumericMaxInput);

    expect(response.isValid).to.be.false;
  });

  it("5. Given min is greater than max option, it should return false", function () {
    const minGreaterThanMaxInput = {
      min: 1,
      max: 0,
      schema: { type: "iso-timestamp" } as SchemaValue,
    };

    const response = validateArray(minGreaterThanMaxInput);

    expect(response.isValid).to.be.false;
  });
});
