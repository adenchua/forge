import { expect } from "chai";
import { describe, it } from "mocha";

import { validateFormatString } from "../../../../src/utils/validators/schema-validators";
import {
  FormatStringAllowedTypes,
  FormatStringOption,
} from "../../../../src/interfaces/schemaOptions";

describe("Testing utility function: validateFormatString", function () {
  it("1. Given valid pattern & properties option, it should return true", function () {
    const response = validateFormatString({
      pattern: "{}.{}",
      properties: [
        {
          type: "boolean",
        },
        {
          type: "numeric-string",
        },
      ],
    });

    expect(response.isValid).to.be.true;
  });

  it("2. Given no pattern option, it should return false", function () {
    const options = {
      properties: [
        {
          type: "boolean",
        },
        {
          type: "numeric-string",
        },
      ],
    } as unknown as FormatStringOption;
    const response = validateFormatString(options);

    expect(response.isValid).to.be.false;
  });

  it("3. Given no properties option, it should return false", function () {
    const options = {
      pattern: "{}.{}",
    };
    const response = validateFormatString(options);

    expect(response.isValid).to.be.false;
  });

  it("4. Given non-string pattern option, it should return false", function () {
    const options: FormatStringOption = {
      pattern: 1 as unknown as string,
      properties: [
        {
          type: "boolean",
        },
        {
          type: "numeric-string",
        },
      ],
    };
    const response = validateFormatString(options);

    expect(response.isValid).to.be.false;
  });

  it("5. Given invalid empty properties option, it should return false", function () {
    const options = {
      pattern: "{}",
      properties: [],
    };
    const response = validateFormatString(options);

    expect(response.isValid).to.be.false;
  });

  it("6. Given invalid property type option, it should return false", function () {
    const options: FormatStringOption = {
      pattern: "{}_{}",
      properties: [
        {
          type: "boolean",
        },
        {
          type: "enum-array" as FormatStringAllowedTypes,
          options: ["apple"],
        },
      ],
    };
    const response = validateFormatString(options);

    expect(response.isValid).to.be.false;
  });

  it("7. Given different lengths of string {} and properties length option, it should return false", function () {
    const options: FormatStringOption = {
      pattern: "{}_{}_{}",
      properties: [
        {
          type: "boolean",
        },
        {
          type: "numeric-string",
        },
      ],
    };
    const response = validateFormatString(options);

    expect(response.isValid).to.be.false;
  });
});
