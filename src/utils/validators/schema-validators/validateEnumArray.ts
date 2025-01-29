import { ValidationResult } from "../../../interfaces/validators";
import { validateEnum } from "./validateEnum";

export function validateEnumArray(
  options: string[] | string,
  reference: Record<string, any>,
): ValidationResult {
  return validateEnum(options, reference);
}
