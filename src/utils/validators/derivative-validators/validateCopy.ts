import { ValidationResult } from "../../../interfaces/validators";
import { CopyOptions } from "../../../interfaces/derivativesOptions";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateCopy(
  options: Partial<CopyOptions>,
  reference: Record<string, any>,
): ValidationResult {
  const errors: string[] = [];
  const { referenceKey } = options;

  const refrenceKeyError = checkObjectProperty(options, "referenceKey", ["string"]);
  refrenceKeyError && errors.push(refrenceKeyError);

  if (referenceKey != undefined) {
    const referenceKeyError2 = checkObjectProperty(reference, referenceKey);
    referenceKeyError2 && errors.push(referenceKeyError2);
  }

  return wrapValidationResult(errors);
}
