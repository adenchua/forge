import { ValidationResult } from "../../../interfaces/validators";
import { UrlOption } from "../../../interfaces/schemaOptions";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateUrl(options: Partial<UrlOption>): ValidationResult {
  const errors: string[] = [];
  const { allowNumbers } = options;

  if (allowNumbers != undefined) {
    const allowNumbersError = checkObjectProperty(options, "allowNumbers", ["boolean"]);
    allowNumbersError && errors.push(allowNumbersError);
  }

  return wrapValidationResult(errors);
}
