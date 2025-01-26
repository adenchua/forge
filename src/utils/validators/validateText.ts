import { containsReferenceString, getReferenceValue } from "../referenceUtils";
import { checkIfOneValueIsNull, checkNumber, checkReferenceValue } from "./validatorHelpers";

export function validateText(fieldName, options, references) {
  let flag = true;
  let { min, max } = options || {};

  if (min === undefined && max === undefined) {
    return true; // no need to check further
  }

  flag = checkIfOneValueIsNull("min", "max", min, max, fieldName);

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

  flag = checkNumber("min", min, fieldName) && flag;
  flag = checkNumber("max", max, fieldName) && flag;

  return flag;
}
