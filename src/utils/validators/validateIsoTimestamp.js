import { differenceInCalendarDays } from "date-fns";

import { containsReferenceString, getReferenceValue } from "../referenceUtils.js";
import {
  checkIfOneValueIsNull,
  checkInvalidISODate,
  checkReferenceValue,
} from "./validatorHelpers.js";

export function validateIsoTimestamp(fieldName, options, references) {
  let flag = true;
  let { dateFrom, dateTo } = options || {};

  if (dateFrom === undefined && dateTo === undefined) {
    return true; // no need to check further
  }

  flag = checkIfOneValueIsNull("dateFrom", "dateTo", dateFrom, dateTo, fieldName);

  if (containsReferenceString(dateFrom)) {
    flag = checkReferenceValue(dateFrom, references, fieldName) && flag;
    if (flag) {
      dateFrom = getReferenceValue(dateFrom, references);
    }
  }

  if (containsReferenceString(dateTo)) {
    flag = checkReferenceValue(dateTo, references, fieldName) && flag;
    if (flag) {
      dateTo = getReferenceValue(dateTo, references);
    }
  }

  flag = checkInvalidISODate("dateFrom", dateFrom, fieldName) && flag;
  flag = checkInvalidISODate("dateTo", dateTo, fieldName) && flag;

  if (flag && differenceInCalendarDays(dateTo, dateFrom) < 0) {
    console.error(`'dateTo' is earlier than 'dateFrom' for field: ${fieldName}`);
    return false;
  }

  return flag;
}
