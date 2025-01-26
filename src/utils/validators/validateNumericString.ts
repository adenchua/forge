import { containsReferenceString, getReferenceValue } from "../referenceUtils";
import {
  checkBoolean,
  checkIfMinIsGreaterThanMax,
  checkIfOneValueIsNull,
  checkNumber,
  checkReferenceValue,
} from "./validatorHelpers";

export function validateNumericString(fieldName, options, references) {
  let flag = true;
  let { min, max, allowLeadingZeros } = options || {};

  if (min === undefined && max === undefined && allowLeadingZeros === undefined) {
    return true;
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

  if (allowLeadingZeros != null) {
    flag = checkBoolean("allowLeadingZeros", allowLeadingZeros, fieldName);
  }

  flag = checkNumber("min", min, fieldName) && flag;
  flag = checkNumber("max", max, fieldName) && flag;

  flag = checkIfMinIsGreaterThanMax(min, max, fieldName) && flag;

  return flag;
}
