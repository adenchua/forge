import { validateFirstName } from "./validateFirstName.js";

export function validateFullName(fieldName, options) {
  return validateFirstName(fieldName, options);
}
