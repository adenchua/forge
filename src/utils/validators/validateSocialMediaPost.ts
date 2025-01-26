import { checkIfMinIsGreaterThanMax, checkNonEmptyArray, checkNumber } from "./validatorHelpers";

export function validateSocialMediaPost(fieldName, options) {
  let flag = true;
  const { languages, min, max, hashtagPercentage, urlPercentage } = options || {};

  if (languages !== undefined) {
    flag = checkNonEmptyArray("languages", languages, fieldName) && flag;
  }

  if (min !== undefined) {
    flag = checkNumber("min", min, fieldName) && flag;
  }

  if (max !== undefined) {
    flag = checkNumber("min", min, fieldName) && flag;
  }

  if (hashtagPercentage !== undefined) {
    flag = checkNumber("hashtagPercentage", hashtagPercentage, fieldName) && flag;
  }

  if (urlPercentage !== undefined) {
    flag = checkNumber("urlPercentage", urlPercentage, fieldName) && flag;
  }

  if (min !== undefined && max !== undefined) {
    flag = checkIfMinIsGreaterThanMax(min, max, fieldName) && flag;
  }

  return flag;
}
