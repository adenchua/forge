import { SchemaReference } from "../../../interfaces/schema";
import { NumericStringOption } from "../../../interfaces/schemaOptions";
import { ValidationResult } from "../../../interfaces/validators";
import { containsReferenceString, parseReferenceValue } from "../../referenceUtils";
import {
  checkObjectProperty,
  checkRange,
  checkReferenceKey,
  wrapValidationResult,
} from "../validatorHelpers";

export function validateNumericString(
  options: Partial<NumericStringOption>,
  reference: SchemaReference,
): ValidationResult {
  const errors: string[] = [];
  const { min, max, allowLeadingZeros } = options;

  if (containsReferenceString(min)) {
    const minReferenceError = checkReferenceKey(min as string, reference, ["number"]);
    if (minReferenceError != null) {
      errors.push(minReferenceError);
    }
  }

  if (containsReferenceString(max)) {
    const maxReferenceError = checkReferenceKey(max as string, reference, ["number"]);
    if (maxReferenceError != null) {
      errors.push(maxReferenceError);
    }
  }

  const tempMin = parseReferenceValue(min, reference);
  const tempMax = parseReferenceValue(max, reference);

  const rangeError = checkRange(tempMin, tempMax);
  if (rangeError != null) {
    errors.push(rangeError);
  }

  if (allowLeadingZeros != null) {
    const allowLeadingZeroesError = checkObjectProperty(options, "allowLeadingZeros", ["boolean"]);
    if (allowLeadingZeroesError != null) {
      errors.push(allowLeadingZeroesError);
    }
  }

  return wrapValidationResult(errors);
}
