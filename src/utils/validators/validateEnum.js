import { getReferenceValue, containsReferenceString } from "../referenceUtils.js";
import { checkNonEmptyArray, checkReferenceValue } from "./validatorHelpers.js";

export function validateEnum(fieldName, options, references) {
  let flag = true;
  let enumOptions = options;

  if (containsReferenceString(options)) {
    flag = checkReferenceValue(options, references, fieldName) && flag;
    if (flag) {
      enumOptions = getReferenceValue(options, references);
    }
  }

  flag = checkNonEmptyArray("options", enumOptions, fieldName) && flag;

  return flag;
}
