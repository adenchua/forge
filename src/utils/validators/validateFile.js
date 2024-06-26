import { checkString } from "./validatorHelpers.js";

export function validateFile(fieldName, options) {
  const { extension } = options || {};

  if (extension === undefined) {
    return true;
  }

  return checkString("extension", extension, fieldName);
}
