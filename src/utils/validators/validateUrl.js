import { checkBoolean } from "./validatorHelpers.js";

export function validateUrl(fieldName, options) {
  const { allowNumbers } = options || {};

  if (allowNumbers === undefined) {
    return true;
  }

  return checkBoolean("allowNumbers", allowNumbers, fieldName);
}
