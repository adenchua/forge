import { ValidationResult } from "../../../classes/SchemaValidator";
import { DateRangeOption } from "../../../interfaces/schemaOptions";
import { containsReferenceString, parseReferenceValue } from "../../referenceUtils";
import { checkISODateRange, checkReferenceKey, wrapValidationResult } from "../validatorHelpers";

export function validateIsoTimestamp(
  options: DateRangeOption,
  reference: Record<string, any>,
): ValidationResult {
  const errors: string[] = [];
  const { dateFrom, dateTo } = options;

  const tempDateFrom = parseReferenceValue(dateFrom, reference);
  const tempDateTo = parseReferenceValue(dateTo, reference);

  if (containsReferenceString(dateFrom)) {
    const dateFromReferenceError = checkReferenceKey(dateFrom as string, reference, ["string"]);
    dateFromReferenceError && errors.push(dateFromReferenceError);
  }

  if (containsReferenceString(dateTo)) {
    const dateToReferenceError = checkReferenceKey(dateTo as string, reference, ["string"]);
    dateToReferenceError && errors.push(dateToReferenceError);
  }

  const rangeError = checkISODateRange(tempDateFrom, tempDateTo);
  rangeError && errors.push(rangeError);

  return wrapValidationResult(errors);
}
