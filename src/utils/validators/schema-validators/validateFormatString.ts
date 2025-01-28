import { ValidationResult } from "../../../classes/SchemaValidator";
import { FormatStringOption } from "../../../interfaces/schemaOptions";
import { checkNonEmptyArray, checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateFormatString(options: Partial<FormatStringOption>): ValidationResult {
  const errors: string[] = [];
  const { properties } = options;

  const patternError = checkObjectProperty(options, "pattern", ["string"]);
  const propertiesError = checkObjectProperty(options, "properties", ["object"]);

  patternError && errors.push(patternError);
  propertiesError && errors.push(propertiesError);

  if (propertiesError != undefined) {
    const propertiesArrayError = checkNonEmptyArray(properties);
    propertiesArrayError && errors.push(propertiesArrayError);
  }

  // TODO: check pattern/properties
  return wrapValidationResult(errors);
}
