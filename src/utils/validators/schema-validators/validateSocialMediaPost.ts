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
    languagesError && errors.push(languagesError);
  }

  if (min !== undefined) {
    const minError = checkObjectProperty(options, "min", ["number"]);
    minError && errors.push(minError);
  }

  if (max !== undefined) {
    const maxError = checkObjectProperty(options, "max", ["number"]);
    maxError && errors.push(maxError);
  }

  if (hashtagPercentage !== undefined) {
    const hashtagPercentageError = checkObjectProperty(options, "hashtagPercentage", ["number"]);
    hashtagPercentageError && errors.push(hashtagPercentageError);
  }

  if (urlPercentage !== undefined) {
    const urlPercentageError = checkObjectProperty(options, "urlPercentage", ["number"]);
    urlPercentageError && errors.push(urlPercentageError);
  }

  const rangeError = checkRange(min, max);
  rangeError && errors.push(rangeError);

  return wrapValidationResult(errors);
}
