import { validateNumber } from "./validateNumber.js";

export function validateFloat(fieldName, options, references) {
  return validateNumber(fieldName, options, references);
}
