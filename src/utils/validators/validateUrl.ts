import { checkBoolean } from "./validatorHelpers";

export function validateUrl(fieldName, options) {
  const { allowNumbers } = options || {};

  if (allowNumbers === undefined) {
    return true;
  }

  return checkBoolean("allowNumbers", allowNumbers, fieldName);
}
