import { ValidationResult } from "../../../interfaces/validators";
import { containsReferenceString, parseReferenceValue } from "../../referenceUtils";
import { checkNonEmptyArray, checkReferenceKey, wrapValidationResult } from "../validatorHelpers";

export function validateEnum(
  options: string[] | string,
  reference: Record<string, any>,
): ValidationResult {
  const errors: string[] = [];

  if (containsReferenceString(options)) {
    const referenceErrors = checkReferenceKey(options as string, reference, ["object"]);
    referenceErrors && errors.push(referenceErrors);
  }

  const enumOptions = parseReferenceValue(options, reference);

  const nonEmptyArrayError = checkNonEmptyArray(enumOptions);
  nonEmptyArrayError && errors.push(nonEmptyArrayError);

  return wrapValidationResult(errors);
}
