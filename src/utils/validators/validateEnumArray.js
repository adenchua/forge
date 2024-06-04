import { validateEnum } from "./validateEnum.js";

export function validateEnumArray(fieldName, options, references) {
  return validateEnum(fieldName, options, references);
}
