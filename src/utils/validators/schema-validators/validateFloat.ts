import { SchemaReference } from "../../../interfaces/schema";
import { MinMaxOption } from "../../../interfaces/schemaOptions";
import { ValidationResult } from "../../../interfaces/validators";
import { validateNumber } from "./validateNumber";

export function validateFloat(
  options: Partial<MinMaxOption>,
  reference: SchemaReference,
): ValidationResult {
  return validateNumber(options, reference);
}
