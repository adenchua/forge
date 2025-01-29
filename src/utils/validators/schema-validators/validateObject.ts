import { SchemaReference } from "../../../interfaces/schema";
import { ObjectOption } from "../../../interfaces/schemaOptions";
import { ValidationResult } from "../../../interfaces/validators";
import {
  checkObjectProperty,
  getSchemaValidationResult,
  wrapValidationResult,
} from "../validatorHelpers";

export function validateObject(
  options: Partial<ObjectOption>,
  reference: SchemaReference = {},
): ValidationResult {
  const errors: string[] = [];
  const { properties } = options;

  const propertiesError = checkObjectProperty(options, "properties", ["object"]);
  if (propertiesError != null) {
    errors.push(propertiesError);
  }

  // go through each properties key and check the value is a valid schema value
  if (properties != null) {
    for (const [, schemaValue] of Object.entries(properties)) {
      const { errors: propertyErrors } = getSchemaValidationResult(schemaValue, reference);
      if (propertyErrors != null) {
        errors.push(...propertyErrors);
      }
    }
  }

  return wrapValidationResult(errors);
}
