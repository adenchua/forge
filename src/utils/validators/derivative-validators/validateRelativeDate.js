import { checkNumber, checkObjectProperty } from "../validatorHelpers.js";
import { checkReferenceKeys } from "./checkReferenceKeys.js";

export function validateRelativeDate(fieldName, options, referencedObject) {
  let flag = true;
  const { referenceKey, days } = options || {};

  flag = checkObjectProperty(options, "referenceKey", fieldName) && flag;
  flag = checkObjectProperty(options, "days", fieldName) && flag;
  flag = checkNumber("days", days, fieldName) && flag;
  flag = checkReferenceKeys([referenceKey], fieldName, referencedObject) && flag;

  return flag;
}
