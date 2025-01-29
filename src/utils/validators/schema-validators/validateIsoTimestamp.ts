import { SchemaReference } from "../../../interfaces/schema";
import { DateRangeOption } from "../../../interfaces/schemaOptions";
import { ValidationResult } from "../../../interfaces/validators";
import { containsReferenceString, parseReferenceValue } from "../../referenceUtils";
import { checkISODateRange, checkReferenceKey, wrapValidationResult } from "../validatorHelpers";

export function validateIsoTimestamp(
  options: DateRangeOption,
  reference: SchemaReference,
): ValidationResult {
  const errors: string[] = [];
  const { dateFrom, dateTo } = options;

  const tempDateFrom = parseReferenceValue(dateFrom, reference);
  const tempDateTo = parseReferenceValue(dateTo, reference);

  if (containsReferenceString(dateFrom)) {
    const dateFromReferenceError = checkReferenceKey(dateFrom as string, reference, ["string"]);
    if (dateFromReferenceError != null) {
      errors.push(dateFromReferenceError);
    }
  }

  if (containsReferenceString(dateTo)) {
    const dateToReferenceError = checkReferenceKey(dateTo as string, reference, ["string"]);
    if (dateToReferenceError != null) {
      errors.push(dateToReferenceError);
    }
  }

  const rangeError = checkISODateRange(tempDateFrom, tempDateTo);
  if (rangeError != null) {
    errors.push(rangeError);
  }

  return wrapValidationResult(errors);
}
