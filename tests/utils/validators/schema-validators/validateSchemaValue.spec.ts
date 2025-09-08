import { expect } from "chai";
import { describe, it } from "mocha";

import { validateSchemaValueProperties } from "../../../../src/utils/validators/schema-validators";
import { SchemaValue } from "../../../../src/interfaces/schema";

describe("Testing utility function: validateSchemaValueProperties", function () {
  it("1. Given a valid schema object, it should return true", function () {
    const validSchema: SchemaValue = { type: "enum" };
    const result = validateSchemaValueProperties(validSchema);

    expect(result.isValid).to.be.true;
  });

  it("2. Given an empty schema object, it should return false", function () {
    const emptySchema = {} as unknown as SchemaValue;
    const result = validateSchemaValueProperties(emptySchema);

    expect(result.isValid).to.be.false;
  });

  it("3. Given an invalid schema object type, it should return false", function () {
    const invalidSchemaType: SchemaValue = { type: "invalid" } as unknown as SchemaValue;
    const result = validateSchemaValueProperties(invalidSchemaType);

    expect(result.isValid).to.be.false;
  });
});
