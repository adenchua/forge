import { ValidationResult } from "../../../interfaces/validators";
import { FORMAT_STRING_ALLOWED_TYPES, FormatStringOption } from "../../../interfaces/schemaOptions";
import {
  checkFormatStringPattern,
  checkNonEmptyArray,
  checkObjectProperty,
  wrapValidationResult,
} from "../validatorHelpers";

export function validateFormatString(options: Partial<FormatStringOption>): ValidationResult {
  const errors: string[] = [];
  const { pattern, properties } = options;

  const patternError = checkObjectProperty(options, "pattern", ["string"]);
  const propertiesError = checkObjectProperty(options, "properties", ["object"]);

  patternError && errors.push(patternError);
  propertiesError && errors.push(propertiesError);

  if (propertiesError != undefined) {
    const propertiesArrayError = checkNonEmptyArray(properties);
    propertiesArrayError && errors.push(propertiesArrayError);
  }

  if (pattern != undefined && properties != undefined) {
    const patternFormatError = checkFormatStringPattern(pattern, properties);
    patternFormatError && errors.push(patternFormatError);
    properties.forEach((property) => {
      if (!FORMAT_STRING_ALLOWED_TYPES.includes(property.type)) {
        errors.push(`Invalid type '${property.type}' supplied`);
      }
    });
  }

  return wrapValidationResult(errors);
}
