import { SchemaReference } from "../../../interfaces/schema";
import { ValidationResult } from "../../../interfaces/validators";
import { validateEnum } from "./validateEnum";

export function validateEnumArray(
  options: string[] | string,
  reference: SchemaReference,
): ValidationResult {
  return validateEnum(options, reference);
}
