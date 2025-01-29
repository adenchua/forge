import { expect } from "chai";
import { describe, it } from "mocha";

import { validateIsoTimestamp } from "../../../../src/utils/validators/schema-validators";
import InvalidReferenceKeyError from "../../../../src/errors/InvalidReferenceKeyError";

describe("Testing utility function: validateIsoTimestamp", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateIsoTimestamp({}, {});

    expect(response.isValid).to.be.true;
  });

  it("2. Given valid dateFrom and dateTo, it should return true", function () {
    const validISODate = "2024-01-01";
    const response = validateIsoTimestamp({ dateFrom: validISODate, dateTo: validISODate }, {});

    expect(response.isValid).to.be.true;
  });

  it("3. Given dateFrom and no dateTo, it should return false", function () {
    const validISODate = "2024-01-01";
    const response = validateIsoTimestamp({ dateFrom: validISODate }, {});

    expect(response.isValid).to.be.false;
  });

  it("4. Given dateTo and no dateFrom, it should return false", function () {
    const validISODate = "2024-01-01";
    const response = validateIsoTimestamp({ dateTo: validISODate }, {});

    expect(response.isValid).to.be.false;
  });

  it("5. Given valid reference key for dateTo and dateFrom, it should return true", function () {
    const referenceString = "#ref.date";
    const response = validateIsoTimestamp(
      { dateFrom: referenceString, dateTo: referenceString },
      { date: "2024-01-01" },
    );

    expect(response.isValid).to.be.true;
  });

  it("6. Given invalid reference key for dateTo and dateFrom, it should throw InvalidReferenceKeyError", function () {
    const referenceString = "#ref.date2";

    expect(() =>
      validateIsoTimestamp(
        { dateFrom: referenceString, dateTo: referenceString },
        { date: "2024-01-01" },
      ),
    ).to.throw(InvalidReferenceKeyError);
  });

  it("7. Given a dateFrom later than dateTo, it should return false", function () {
    const dateTo = "2022-01-01";
    const dateFrom = "2023-01-01";
    const response = validateIsoTimestamp({ dateFrom, dateTo }, {});

    expect(response.isValid).to.be.false;
  });

  it("8. Given invalid dateFrom, it should return false", function () {
    const dateTo = "2022-01-01";
    const dateFrom = "2023301-01";
    const response = validateIsoTimestamp({ dateFrom, dateTo }, {});

    expect(response.isValid).to.be.false;
  });
});
