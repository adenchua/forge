import { ValidationResult } from "../../../classes/SchemaValidator";
import { ArrayOption } from "../../../interfaces/schemaOptions";
import { checkObjectProperty, checkRange, wrapValidationResult } from "../validatorHelpers";
import { validateSchemaValue } from "./validateSchemaValue";

export function validateArray(options: Partial<ArrayOption>): ValidationResult {
  const errors: string[] = [];

  const { schema, min, max } = options;
  const schemaError = checkObjectProperty(options, "schema", ["object"]);
  const minError = checkObjectProperty(options, "min", ["number"]);
  const maxError = checkObjectProperty(options, "max", ["number"]);

  const rangeError = checkRange(min, max);
  rangeError && errors.push(rangeError);

  if (schema != undefined) {
    const schemaValidation = validateSchemaValue(schema);
    const { errors: schemaErrors } = schemaValidation;
    if (schemaErrors) {
      errors.push(...schemaErrors);
    }
  }

  schemaError && errors.push(schemaError);
  minError && errors.push(minError);
  maxError && errors.push(maxError);

  return wrapValidationResult(errors);
}
