import { ValidationResult } from "../../../classes/SchemaValidator";
import { GenderOption } from "../../../interfaces/schemaOptions";
import { validateFirstName } from "./validateFirstName";

export function validateFullName(options: Partial<GenderOption>): ValidationResult {
  return validateFirstName(options);
}
