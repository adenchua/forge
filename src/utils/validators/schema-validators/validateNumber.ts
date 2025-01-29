import { SchemaReference } from "../../../interfaces/schema";
import { MinMaxOption } from "../../../interfaces/schemaOptions";
import { ValidationResult } from "../../../interfaces/validators";
import { containsReferenceString, parseReferenceValue } from "../../referenceUtils";
import { checkRange, checkReferenceKey, wrapValidationResult } from "../validatorHelpers";

export function validateNumber(
  options: Partial<MinMaxOption>,
  reference: SchemaReference,
): ValidationResult {
  const errors: string[] = [];
  const { min, max } = options;

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

  return wrapValidationResult(errors);
}
