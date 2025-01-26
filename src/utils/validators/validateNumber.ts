import { containsReferenceString, getReferenceValue } from "../referenceUtils";
import { checkIfMinIsGreaterThanMax, checkNumber, checkReferenceValue } from "./validatorHelpers";

export function validateNumber(fieldName, options, references) {
  let flag = true;
  let { min, max } = options || {};

  if (min === undefined && max === undefined) {
    return true;
  }

  if (containsReferenceString(min)) {
    flag = checkReferenceValue(min, references, fieldName) && flag;
    if (flag) {
      min = getReferenceValue(min, references);
    }
  }

  if (containsReferenceString(max)) {
    flag = checkReferenceValue(max, references, fieldName) && flag;
    if (flag) {
      max = getReferenceValue(max, references);
    }
  }

  if (min != null) {
    flag = checkNumber("min", min, fieldName) && flag;
  }

  if (max != null) {
    flag = checkNumber("max", max, fieldName) && flag;
  }

  if (min != null && max != null) {
    flag = checkIfMinIsGreaterThanMax(min, max, fieldName) && flag;
  }

  return flag;
}
