import { MinMaxOption } from "../../../interfaces/schemaOptions";
import { ValidationResult } from "../../../interfaces/validators";
import { validateNumber } from "./validateNumber";

export function validateFloat(
  options: Partial<MinMaxOption>,
  reference: Record<string, any>,
): ValidationResult {
  return validateNumber(options, reference);
}
