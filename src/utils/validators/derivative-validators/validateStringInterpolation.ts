import {
  checkObjectProperty,
  checkString,
  checkNonEmptyArray,
  isString,
  isValidNonEmptyArray,
} from "../validatorHelpers";
import { checkReferenceKeys } from "./checkReferenceKeys";

export function validateStringInterpolation(fieldName, options, referencedObject) {
  let flag = true;
  const { string, referenceKeys } = options || {};

  flag = checkObjectProperty(options, "string", fieldName) && flag;
  flag = checkObjectProperty(options, "referenceKeys", fieldName) && flag;
  flag = checkString("string", string, fieldName) && flag;
  flag = checkNonEmptyArray("referenceKeys", referenceKeys, fieldName) && flag;
  flag = checkReferenceKeys(referenceKeys, fieldName, referencedObject) && flag;

  if (isString(string) && isValidNonEmptyArray(referenceKeys)) {
    const numberOfVariables = (string.match(/{}/g) || []).length;

    if (numberOfVariables !== referenceKeys.length) {
      console.error(
        `number of '{}' in string format does not match the number of reference keys for field: ${fieldName}`,
      );
      flag = false;
    }
  }

  return flag;
}
