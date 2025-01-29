import { ValidationResult } from "../../../interfaces/validators";
import { GenderOption } from "../../../interfaces/schemaOptions";
import { checkGender, wrapValidationResult } from "../validatorHelpers";

export function validateFirstName(options: Partial<GenderOption>): ValidationResult {
  const errors: string[] = [];
  const { gender } = options;

  if (gender != undefined) {
    const genderError = checkGender(gender);
    genderError && errors.push(genderError);
  }

  return wrapValidationResult(errors);
}
