import { ArrayOption } from "../../../interfaces/schemaOptions";
import { ValidationResult } from "../../../interfaces/validators";
import { checkObjectProperty, checkRange, wrapValidationResult } from "../validatorHelpers";
import { validateSchemaValue } from "./validateSchemaValue";

export function validateArray(options: Partial<ArrayOption>): ValidationResult {
  const errors: string[] = [];

  const { schema, min, max } = options;
  const schemaError = checkObjectProperty(options, "schema", ["object"]);
  const minError = checkObjectProperty(options, "min", ["number"]);
  const maxError = checkObjectProperty(options, "max", ["number"]);

  const rangeError = checkRange(min, max);
  if (rangeError != null) {
    errors.push(rangeError);
  }

  if (schema != undefined) {
    const schemaValidation = validateSchemaValue(schema);
    const { errors: schemaErrors } = schemaValidation;
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
