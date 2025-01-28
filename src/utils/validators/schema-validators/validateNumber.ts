import { ValidationResult } from "../../../classes/SchemaValidator";
import { MinMaxOption } from "../../../interfaces/schemaOptions";
import { containsReferenceString, parseReferenceValue } from "../../referenceUtils";
import { checkRange, checkReferenceKey, wrapValidationResult } from "../validatorHelpers";

export function validateNumber(
  options: Partial<MinMaxOption>,
  reference: Record<string, any>,
): ValidationResult {
  const errors: string[] = [];
  const { min, max } = options;

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

  return wrapValidationResult(errors);
}
