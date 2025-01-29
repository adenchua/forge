import { ValidationResult } from "../../../interfaces/validators";
import { SocialMediaPostOption } from "../../../interfaces/schemaOptions";
import {
  checkNonEmptyArray,
  checkObjectProperty,
  checkRange,
  wrapValidationResult,
} from "../validatorHelpers";

export function validateSocialMediaPost(options: Partial<SocialMediaPostOption>): ValidationResult {
  const errors: string[] = [];
  const { languages, min, max, hashtagPercentage, urlPercentage } = options;

  if (languages !== undefined) {
    const languagesError = checkNonEmptyArray(languages);
    if (languagesError != null) {
      errors.push(languagesError);
    }
  }

  if (min !== undefined) {
    const minError = checkObjectProperty(options, "min", ["number"]);
    if (minError != null) {
      errors.push(minError);
    }
  }

  if (max !== undefined) {
    const maxError = checkObjectProperty(options, "max", ["number"]);
    if (maxError != null) {
      errors.push(maxError);
    }
  }

  if (hashtagPercentage !== undefined) {
    const hashtagPercentageError = checkObjectProperty(options, "hashtagPercentage", ["number"]);
    if (hashtagPercentageError != null) {
      errors.push(hashtagPercentageError);
    }
  }

  if (urlPercentage !== undefined) {
    const urlPercentageError = checkObjectProperty(options, "urlPercentage", ["number"]);
    if (urlPercentageError != null) {
      errors.push(urlPercentageError);
    }
  }

  const rangeError = checkRange(min, max);
  if (rangeError != null) {
    errors.push(rangeError);
  }

  return wrapValidationResult(errors);
}
