import { checkObjectProperty } from "../validatorHelpers";
import { checkReferenceKeys } from "./checkReferenceKeys";

export function validateCopy(fieldName, options, referencedObject) {
  let flag = true;
  const { referenceKey } = options || {};

  flag = checkObjectProperty(options, "referenceKey", fieldName) && flag;
  flag = checkReferenceKeys([referenceKey], fieldName, referencedObject) && flag;

  return flag;
}
