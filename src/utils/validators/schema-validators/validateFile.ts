import { ValidationResult } from "../../../interfaces/validators";
import { FileOption } from "../../../interfaces/schemaOptions";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateFile(options: Partial<FileOption>): ValidationResult {
  const errors: string[] = [];
  const { extension } = options;

  if (extension != undefined) {
    const extensionError = checkObjectProperty(options, "extension", ["string"]);
    if (extensionError != null) {
      errors.push(extensionError);
    }
  }

  return wrapValidationResult(errors);
}
