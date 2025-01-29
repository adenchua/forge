import { ValidationResult } from "../../../interfaces/validators";
import { RelativeDateOptions } from "../../../interfaces/derivativesOptions";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateRelativeDate(
  options: Partial<RelativeDateOptions>,
  reference: Record<string, any>,
): ValidationResult {
  const errors: string[] = [];
  const { referenceKey } = options;

  const referenceKeyError = checkObjectProperty(options, "referenceKey", ["string"]);
  referenceKeyError && errors.push(referenceKeyError);

  const daysError = checkObjectProperty(options, "days", ["number"]);
  daysError && errors.push(daysError);

  if (referenceKey != undefined) {
    const referenceKeyError2 = checkObjectProperty(reference, referenceKey);
    referenceKeyError2 && errors.push(referenceKeyError2);
  }

  return wrapValidationResult(errors);
}
