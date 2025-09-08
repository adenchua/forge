import { ValidationResult } from "../../../interfaces/validators";
import { VALID_SCHEMA_TYPES } from "../../../constants";
import { SchemaValue } from "../../../interfaces/schema";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

/**
 * Does a check to see if the 'type', 'isNullable' and 'nullablePercentage'
 * is valid
 */
export function validateSchemaValueProperties(schemaValue: SchemaValue): ValidationResult {
  const errors: string[] = [];
  const { type, isNullable, nullablePercentage } = schemaValue;

  const typeError = checkObjectProperty(schemaValue, "type", ["string"]);
  if (typeError != null) {
    errors.push(typeError);
  }

  if (!VALID_SCHEMA_TYPES.includes(type)) {
    errors.push(`Invalid type '${type}' supplied`);
  }

  if (isNullable != undefined) {
    const isNullableError = checkObjectProperty(schemaValue, "isNullable", ["boolean"]);
    if (isNullableError != null) {
      errors.push(isNullableError);
    }
  }

  if (nullablePercentage != undefined) {
    const nullablePercentageError = checkObjectProperty(schemaValue, "nullablePercentage", [
      "number",
    ]);
    if (nullablePercentageError != null) {
      errors.push(nullablePercentageError);
    }
  }

  return wrapValidationResult(errors);
}
