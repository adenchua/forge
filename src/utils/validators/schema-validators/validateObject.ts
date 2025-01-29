import { ValidationResult } from "../../../interfaces/validators";
import { ObjectOption } from "../../../interfaces/schemaOptions";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateObject(options: Partial<ObjectOption>): ValidationResult {
  const errors: string[] = [];

  const propertiesError = checkObjectProperty(options, "properties", ["object"]);
  propertiesError && errors.push(propertiesError);

  // TODO: check contents of properties
  return wrapValidationResult(errors);
}
