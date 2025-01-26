import { validateNumber } from "./validateNumber";

export function validateFloat(fieldName, options, references) {
  return validateNumber(fieldName, options, references);
}
