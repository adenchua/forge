import { differenceInCalendarDays, isValid } from "date-fns";

import { validateCopy } from "./derivative-validators/validateCopy";
import { validateRelativeDate } from "./derivative-validators/validateRelativeDate";
import { validateStringInterpolation } from "./derivative-validators/validateStringInterpolation";
import { ValidationResult } from "../../classes/SchemaValidator";

export function validateDerivativeType(type, options, fieldName, referencedObject) {
  switch (type) {
    case "string-interpolation":
      return validateStringInterpolation(fieldName, options, referencedObject);
    case "copy":
      return validateCopy(fieldName, options, referencedObject);
    case "date-before":
      return validateRelativeDate(fieldName, options, referencedObject);
    case "date-after":
      return validateRelativeDate(fieldName, options, referencedObject);
    default:
      console.error(`Invalid type '${type}' for field: ${fieldName}`);
      return false;
  }
}

export function validateSchemaType(type, options, fieldName, references) {
  switch (type) {
    case "enum":
      return validateEnum(fieldName, options, references);
    case "enum-array":
      return validateEnumArray(fieldName, options, references);
    case "iso-timestamp":
      return validateIsoTimestamp(fieldName, options, references);
    case "text":
      return validateText(fieldName, options, references);
    case "numeric-string":
      return validateNumericString(fieldName, options, references);
    case "url":
      return validateUrl(fieldName, options);
    case "array":
      return validateArray(fieldName, options, references);
    case "number":
      return validateNumber(fieldName, options, references);
    case "float":
      return validateFloat(fieldName, options, references);
    case "first-name":
      return validateFirstName(fieldName, options);
    case "last-name":
      return validateLastName(fieldName, options);
    case "full-name":
      return validateFullName(fieldName, options);
    case "object":
      return validateObject(fieldName, options, references);
    case "file":
      return validateFile(fieldName, options);
    case "social-media-post":
      return validateSocialMediaPost(fieldName, options);
    case "format-string":
      return validateFormatString(fieldName, options);
    case "id":
      return true; // no need for validation since no user input
    case "boolean":
      return true;
    case "email":
      return true;
    case "country":
      return true;
    case "country-code":
      return true;
    case "url-image":
      return true;
    case "username":
      return true;
    case "gender":
      return true;
    case "user-bio":
      return true;
    case "url-domain":
      return true;
    default:
      console.error(`Invalid type '${type}' for field: ${fieldName}`);
      return false;
  }
}

export function isValidNonEmptyArray(value: unknown) {
  return value !== null && Array.isArray(value) && value.length > 0;
}

export function checkGender(value: string): string | null {
  if (!["male", "female"].includes(value)) {
    return `Invalid gender '${value} provided`;
  }

  return null;
}

export function checkReferenceKey(
  referenceString: string,
  references: Record<string, any>,
  referencedValueType: Array<
    "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
  >,
): string | null {
  const [, referenceKey] = referenceString.split("#ref.");
  if (!references.hasOwnProperty(referenceKey)) {
    return `Invalid reference key '${referenceKey}' provided`;
  }

  if (!referencedValueType.includes(typeof references[referenceKey])) {
    return `Invalid type for property ${referenceString}`;
  }

  return null;
}

export function checkFormatStringPattern(
  pattern: string,
  properties: Array<unknown>,
): string | null {
  const numberOfVariables = (pattern.match(/{}/g) || []).length;

  if (numberOfVariables !== properties.length) {
    return `number of '{}' in pattern does not match the number of referenced properties`;
  }

  return null;
}

export function checkObjectProperty(
  object: Record<string, any>,
  property: string,
  valueTypes?: Array<
    "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
  >,
): string | null {
  if (!object.hasOwnProperty(property)) {
    return `Missing object property '${property}'`;
  }

  if (valueTypes != undefined && !valueTypes.includes(typeof object[property])) {
    return `Invalid type for property ${property}`;
  }

  return null;
}

export function checkNonEmptyArray(value: unknown): string | null {
  if (!isValidNonEmptyArray(value)) {
    return "Must provide a non-empty array";
  }

  return null;
}

export function checkISODateRange(dateFrom?: string, dateTo?: string): string | null {
  const dateFromUndefined = dateFrom === undefined && dateTo !== undefined;
  const dateToUndefined = dateFrom !== undefined && dateTo === undefined;
  const bothDefined = dateFrom !== undefined && dateTo !== undefined;

  if (dateFromUndefined || dateToUndefined) {
    return "Both dateFrom and dateTo must be provided";
  }

  if (bothDefined && !isValid(new Date(dateFrom))) {
    return `dateFrom is an invalid ISO8601 format`;
  }

  if (bothDefined && !isValid(new Date(dateTo))) {
    return `dateTo is an invalid ISO8601 format`;
  }

  if (bothDefined && differenceInCalendarDays(dateTo, dateFrom) < 0) {
    return "dateFrom cannot be later than dateTo";
  }

  return null;
}

export function checkRange(min?: number, max?: number): string | null {
  const minUndefined = min === undefined && max !== undefined;
  const maxUndefined = min !== undefined && max === undefined;
  const bothDefined = min !== undefined && max !== undefined;

  if (minUndefined || maxUndefined) {
    return "Both min and max must be provided";
  }

  if (bothDefined && min > max) {
    return "min cannot be greater than max";
  }

  return null;
}

export function wrapValidationResult(errors: string[]): ValidationResult {
  if (errors.length === 0) {
    return { isValid: true };
  }

  return { isValid: false, errors };
}
