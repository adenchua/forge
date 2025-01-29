import { ValidationResult } from "../../../interfaces/validators";
import { VALID_SCHEMA_TYPES } from "../../../constants";
import { SchemaValue } from "../../../interfaces/schema";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateSchemaValue(schemaValue: SchemaValue): ValidationResult {
  const errors: string[] = [];
  const { type, isNullable, nullablePercentage } = schemaValue;

  const typeError = checkObjectProperty(schemaValue, "type", ["string"]);
  typeError && errors.push(typeError);

  if (!VALID_SCHEMA_TYPES.includes(type)) {
    errors.push(`Invalid type '${type}' supplied`);
  }

  if (isNullable != undefined) {
    const isNullableError = checkObjectProperty(schemaValue, "isNullable", ["boolean"]);
    isNullableError && errors.push(isNullableError);
  }

  if (nullablePercentage != undefined) {
    const nullablePercentageError = checkObjectProperty(schemaValue, "nullablePercentage", [
      "number",
    ]);
    nullablePercentageError && errors.push(nullablePercentageError);
  }

  // TODO: check whether options is provided for some compulsory ones

  return wrapValidationResult(errors);
}
