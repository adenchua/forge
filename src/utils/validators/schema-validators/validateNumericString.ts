import { ValidationResult } from "../../../interfaces/validators";
import { NumericStringOption } from "../../../interfaces/schemaOptions";
import { containsReferenceString, parseReferenceValue } from "../../referenceUtils";
import {
  checkObjectProperty,
  checkRange,
  checkReferenceKey,
  wrapValidationResult,
} from "../validatorHelpers";

export function validateNumericString(
  options: Partial<NumericStringOption>,
  reference: Record<string, any>,
): ValidationResult {
  const errors: string[] = [];
  const { min, max, allowLeadingZeros } = options;

  if (containsReferenceString(min)) {
    const minReferenceError = checkReferenceKey(min as string, reference, ["number"]);
    minReferenceError && errors.push(minReferenceError);
  }

  if (containsReferenceString(max)) {
    const maxReferenceError = checkReferenceKey(max as string, reference, ["number"]);
    maxReferenceError && errors.push(maxReferenceError);
  }

  const tempMin = parseReferenceValue(min, reference);
  const tempMax = parseReferenceValue(max, reference);

  const rangeError = checkRange(tempMin, tempMax);
  rangeError && errors.push(rangeError);

  if (allowLeadingZeros != null) {
    const allowLeadingZeroesError = checkObjectProperty(options, "allowLeadingZeros", ["boolean"]);
    allowLeadingZeroesError && errors.push(allowLeadingZeroesError);
  }

  return wrapValidationResult(errors);
}
