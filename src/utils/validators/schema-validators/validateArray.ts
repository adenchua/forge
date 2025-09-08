import { SchemaReference } from "../../../interfaces/schema";
import { ArrayOption } from "../../../interfaces/schemaOptions";
import { ValidationResult } from "../../../interfaces/validators";
import {
  checkObjectProperty,
  checkRange,
  getSchemaValidationResult,
  wrapValidationResult,
} from "../validatorHelpers";

export function validateArray(
  options: Partial<ArrayOption>,
  references: SchemaReference,
): ValidationResult {
  const errors: string[] = [];

  const { schema, min, max } = options;
  const schemaError = checkObjectProperty(options, "schema", ["object"]);
  const minError = checkObjectProperty(options, "min", ["number"]);
  const maxError = checkObjectProperty(options, "max", ["number"]);

  const rangeError = checkRange(min, max);
  if (rangeError != null) {
    errors.push(rangeError);
  }

  // check the type defined in the array schema if its valid
  if (schema != undefined) {
    const validationResult = getSchemaValidationResult(schema, references);
    const { errors: schemaErrors } = validationResult;
    if (schemaErrors) {
      errors.push(...schemaErrors);
    }
  }
  if (schemaError != null) {
    errors.push(schemaError);
  }

  if (minError != null) {
    errors.push(minError);
  }
  if (maxError != null) {
    errors.push(maxError);
  }

  return wrapValidationResult(errors);
}
