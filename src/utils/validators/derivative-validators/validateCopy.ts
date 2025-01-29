import { CopyOptions } from "../../../interfaces/derivativesOptions";
import { SchemaReference } from "../../../interfaces/schema";
import { ValidationResult } from "../../../interfaces/validators";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateCopy(
  options: Partial<CopyOptions>,
  reference: SchemaReference,
): ValidationResult {
  const errors: string[] = [];
  const { referenceKey } = options;

  const refrenceKeyError = checkObjectProperty(options, "referenceKey", ["string"]);
  if (refrenceKeyError !== null) {
    errors.push(refrenceKeyError);
  }

  if (referenceKey != undefined) {
    const referenceKeyError2 = checkObjectProperty(reference, referenceKey);
    if (referenceKeyError2 != null) {
      errors.push(referenceKeyError2);
    }
  }

  return wrapValidationResult(errors);
}
