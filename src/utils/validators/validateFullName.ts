import { validateFirstName } from "./validateFirstName";

export function validateFullName(fieldName, options) {
  return validateFirstName(fieldName, options);
}
