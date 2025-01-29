import { expect } from "chai";
import { describe, it } from "mocha";

import { validateSchemaValue } from "../../../../src/utils/validators/schema-validators";
import { SchemaValue } from "../../../../src/interfaces/schema";

describe("Testing utility function: validateSchemaValue", function () {
  it("1. Given a valid schema object, it should return true", function () {
    const validSchema: SchemaValue = { type: "enum" };
    const result = validateSchemaValue(validSchema);

    expect(result.isValid).to.be.true;
  });

  it("2. Given an empty schema object, it should return false", function () {
    const emptySchema = {} as unknown as SchemaValue;
    const result = validateSchemaValue(emptySchema);

    expect(result.isValid).to.be.false;
  });

  it("3. Given an invalid schema object type, it should return false", function () {
    const invalidSchemaType: SchemaValue = { type: "invalid" } as unknown as SchemaValue;
    const result = validateSchemaValue(invalidSchemaType);

    expect(result.isValid).to.be.false;
  });
});
