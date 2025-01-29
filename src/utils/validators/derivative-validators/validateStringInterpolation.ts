import { StringInterpolationOptions } from "../../../interfaces/derivativesOptions";
import { SchemaReference } from "../../../interfaces/schema";
import { ValidationResult } from "../../../interfaces/validators";
import {
  checkFormatStringPattern,
  checkNonEmptyArray,
  checkObjectProperty,
  wrapValidationResult,
} from "../validatorHelpers";

export function validateStringInterpolation(
  options: Partial<StringInterpolationOptions>,
  reference: SchemaReference,
): ValidationResult {
  const errors: string[] = [];
  const { pattern, referenceKeys } = options;

  const patternError = checkObjectProperty(options, "pattern", ["string"]);
  const referenceKeysError = checkObjectProperty(options, "referenceKeys", ["object"]);
  if (patternError != null) {
    errors.push(patternError);
  }
  if (referenceKeysError != null) {
    errors.push(referenceKeysError);
  }

  if (referenceKeys != undefined) {
    const referenceKeysArrayError = checkNonEmptyArray(referenceKeys);
    if (referenceKeysArrayError != null) {
      errors.push(referenceKeysArrayError);
    }
  }

  if (pattern != undefined && referenceKeys != undefined) {
    const patternFormatError = checkFormatStringPattern(pattern, referenceKeys);
    if (patternFormatError != null) {
      errors.push(patternFormatError);
    }

    referenceKeys.forEach((referenceKey) => {
      const referenceKeyError = checkObjectProperty(reference, referenceKey);
      if (referenceKeyError != null) {
        errors.push(referenceKeyError);
      }
    });
  }

  return wrapValidationResult(errors);
}
