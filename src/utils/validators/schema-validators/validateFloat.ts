import { MinMaxOption } from "../../../interfaces/schemaOptions";
import { validateNumber } from "./validateNumber";

export function validateFloat(options: Partial<MinMaxOption>, reference: Record<string, any>) {
  return validateNumber(options, reference);
}
