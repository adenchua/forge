import { expect } from "chai";
import { describe, it } from "mocha";

import { SchemaValue } from "../../../../src/interfaces/schema";
import { ObjectOption } from "../../../../src/interfaces/schemaOptions";
import { validateObject } from "../../../../src/utils/validators/schema-validators";

describe("Testing utility function: validateObject", function () {
  it("1. Given valid properties option, it should return true", function () {
    const input: ObjectOption = {
      properties: {
        testField: {
          type: "iso-timestamp",
        },
      },
    };

    const response = validateObject(input);

    expect(response.isValid).to.be.true;
  });

  it("2. Given no options, it should return false", function () {
    const response = validateObject({});

    expect(response.isValid).to.be.false;
  });

  it("3. Given empty property, it should return true", function () {
    const response = validateObject({ properties: {} });

    expect(response.isValid).to.be.true;
  });

  it("4. Given properties with invalid item type, it should return false", function () {
    const input: ObjectOption = {
      properties: {
        testField: {
          type: "iso-timestampp" as SchemaValue["type"],
        },
      },
    };

    const response = validateObject(input);

    expect(response.isValid).to.be.false;
  });

  it("5. Given properties without 'type', it should return false", function () {
    const input: ObjectOption = {
      properties: {
        testField: {} as SchemaValue,
      },
    };

    const response = validateObject(input);

    expect(response.isValid).to.be.false;
  });

  it("6. Given properties with invalid 'type', it should return false", function () {
    const input: ObjectOption = {
      properties: {
        testField: {
          type: "invalid-type",
        } as unknown as SchemaValue,
      },
    };

    const response = validateObject(input);

    expect(response.isValid).to.be.false;
  });

  it("7. Given properties with undefined 'type', it should return false", function () {
    const input: ObjectOption = {
      properties: {
        testField: {
          type: undefined,
        } as unknown as SchemaValue,
      },
    };

    const response = validateObject(input);

    expect(response.isValid).to.be.false;
  });

  it("7. Given properties with nested undefined 'type', it should return false", function () {
    const input: ObjectOption = {
      properties: {
        testField: {
          type: "object",
          options: {
            properties: {
              invalidField: {
                type: undefined,
              },
            },
          },
        } as unknown as SchemaValue,
      },
    };

    const response = validateObject(input);

    expect(response.isValid).to.be.false;
  });
});
