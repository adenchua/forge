import { checkObjectProperty } from "../validatorHelpers.js";

const VALID_TYPES = ["string-interpolation", "copy", "date-before", "date-after"];

export function validateDerivativeField(fieldName, derivative) {
  let flag = true;

  flag = checkObjectProperty(derivative, "type", fieldName);

  if (derivative != null && !VALID_TYPES.includes(derivative.type)) {
    console.error(`Invalid type '${derivative.type}' supplied for field: ${fieldName}`);
    flag = false;
  }

  return flag;
}
