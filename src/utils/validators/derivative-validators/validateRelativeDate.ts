import { RelativeDateOptions } from "../../../interfaces/derivativesOptions";
import { SchemaReference } from "../../../interfaces/schema";
import { ValidationResult } from "../../../interfaces/validators";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateRelativeDate(
  options: Partial<RelativeDateOptions>,
  reference: SchemaReference,
): ValidationResult {
  const errors: string[] = [];
  const { referenceKey } = options;

  const referenceKeyError = checkObjectProperty(options, "referenceKey", ["string"]);
  if (referenceKeyError != null) {
    errors.push(referenceKeyError);
  }

  const daysError = checkObjectProperty(options, "days", ["number"]);
  if (daysError != null) {
    errors.push(daysError);
  }

  if (referenceKey != undefined) {
    const referenceKeyError2 = checkObjectProperty(reference, referenceKey);
    if (referenceKeyError2 != null) {
      errors.push(referenceKeyError2);
    }
  }

  return wrapValidationResult(errors);
}
