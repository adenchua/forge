import { SchemaReference } from "../../../interfaces/schema";
import { ValidationResult } from "../../../interfaces/validators";
import { containsReferenceString, parseReferenceValue } from "../../referenceUtils";
import { checkNonEmptyArray, checkReferenceKey, wrapValidationResult } from "../validatorHelpers";

export function validateEnum(
  options: string[] | string,
  reference: SchemaReference,
): ValidationResult {
  const errors: string[] = [];

  if (containsReferenceString(options)) {
    const referenceErrors = checkReferenceKey(options as string, reference, ["object"]);
    if (referenceErrors != null) {
      errors.push(referenceErrors);
    }
  }

  const enumOptions = parseReferenceValue(options, reference);

  const nonEmptyArrayError = checkNonEmptyArray(enumOptions);
  if (nonEmptyArrayError != null) {
    errors.push(nonEmptyArrayError);
  }

  return wrapValidationResult(errors);
}
