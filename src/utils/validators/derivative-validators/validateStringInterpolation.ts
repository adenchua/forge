import { ValidationResult } from "../../../classes/SchemaValidator";
import { StringInterpolationOptions } from "../../../interfaces/derivativesOptions";
import {
  checkFormatStringPattern,
  checkNonEmptyArray,
  checkObjectProperty,
  wrapValidationResult,
} from "../validatorHelpers";

export function validateStringInterpolation(
  options: Partial<StringInterpolationOptions>,
  reference: Record<string, any>,
): ValidationResult {
  const errors: string[] = [];
  const { pattern, referenceKeys } = options;

  const patternError = checkObjectProperty(options, "pattern", ["string"]);
  const referenceKeysError = checkObjectProperty(options, "referenceKeys", ["object"]);

  patternError && errors.push(patternError);
  referenceKeysError && errors.push(referenceKeysError);

  if (referenceKeys != undefined) {
    const referenceKeysArrayError = checkNonEmptyArray(referenceKeys);
    referenceKeysArrayError && errors.push(referenceKeysArrayError);
  }

  if (pattern != undefined && referenceKeys != undefined) {
    const patternFormatError = checkFormatStringPattern(pattern, referenceKeys);
    patternFormatError && errors.push(patternFormatError);
  }

  return wrapValidationResult(errors);
}
