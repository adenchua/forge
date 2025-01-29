import { differenceInCalendarDays, isValid } from "date-fns";

import InvalidSchemaTypeError from "../../errors/InvalidSchemaTypeError";
import { SchemaReference, SchemaValue } from "../../interfaces/schema";
import {
  ArrayOption,
  DateRangeOption,
  FileOption,
  FormatStringOption,
  GenderOption,
  MinMaxOption,
  NumericStringOption,
  ObjectOption,
  SocialMediaPostOption,
  UrlOption,
} from "../../interfaces/schemaOptions";
import { ValidationResult } from "../../interfaces/validators";
import {
  validateArray,
  validateEnum,
  validateEnumArray,
  validateFile,
  validateFirstName,
  validateFloat,
  validateFormatString,
  validateFullName,
  validateIsoTimestamp,
  validateLastName,
  validateNumber,
  validateNumericString,
  validateObject,
  validateSchemaValue,
  validateSocialMediaPost,
  validateText,
  validateUrl,
} from "./schema-validators";

export function getSchemaValidationResult(
  schemaValue: SchemaValue,
  reference: SchemaReference,
): ValidationResult {
  const { type, options = {} } = schemaValue;
  // check if valid type, nullablePercentage and isNullable
  const { isValid, errors } = validateSchemaValue(schemaValue);

  // provided schema type has error
  if (!isValid) {
    return wrapValidationResult(errors!);
  }

  switch (type) {
    case "enum":
      return validateEnum(options as string[] | string, reference);
    case "enum-array":
      return validateEnumArray(options as string[] | string, reference);
    case "iso-timestamp":
      return validateIsoTimestamp(options as DateRangeOption, reference);
    case "text":
      return validateText(options as MinMaxOption, reference);
    case "numeric-string":
      return validateNumericString(options as NumericStringOption, reference);
    case "url":
      return validateUrl(options as UrlOption);
    case "array":
      return validateArray(options as ArrayOption);
    case "number":
      return validateNumber(options as MinMaxOption, reference);
    case "float":
      return validateFloat(options as MinMaxOption, reference);
    case "first-name":
      return validateFirstName(options as GenderOption);
    case "last-name":
      return validateLastName(options as GenderOption);
    case "full-name":
      return validateFullName(options as GenderOption);
    case "object":
      return validateObject(options as ObjectOption, reference);
    case "file":
      return validateFile(options as FileOption);
    case "social-media-post":
      return validateSocialMediaPost(options as SocialMediaPostOption);
    case "format-string":
      return validateFormatString(options as FormatStringOption);
    case "id":
      return wrapValidationResult([]); // no need for validation since no user input
    case "boolean":
      return wrapValidationResult([]);
    case "email":
      return wrapValidationResult([]);
    case "country":
      return wrapValidationResult([]);
    case "country-code":
      return wrapValidationResult([]);
    case "url-image":
      return wrapValidationResult([]);
    case "username":
      return wrapValidationResult([]);
    case "gender":
      return wrapValidationResult([]);
    case "user-bio":
      return wrapValidationResult([]);
    case "url-domain":
      return wrapValidationResult([]);
    default:
      throw new InvalidSchemaTypeError();
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
  references: SchemaReference,
  referencedValueType: Array<
    "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
  >,
): string | null {
  const [, referenceKey] = referenceString.split("#ref.");
  if (!Object.hasOwn(references, referenceKey)) {
    return `Invalid reference key '${referenceKey}' provided`;
  }

  if (!referencedValueType.includes(typeof references[referenceKey])) {
    return `Invalid type for property ${referenceString}`;
  }

  return null;
}

export function checkFormatStringPattern(
  pattern: unknown,
  properties: Array<unknown>,
): string | null {
  if (typeof pattern !== "string") {
    return "pattern must be a string type";
  }

  const numberOfVariables = (pattern.match(/{}/g) || []).length;

  if (properties.length === 0) {
    return `properties cannot be empty`;
  }

  if (numberOfVariables !== properties.length) {
    return `number of '{}' in pattern does not match the number of referenced properties`;
  }

  return null;
}

export function checkObjectProperty(
  object: Record<string, unknown>,
  property: string,
  valueTypes?: Array<
    "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
  >,
): string | null {
  if (!Object.hasOwn(object, property)) {
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

  if (bothDefined && typeof min !== "number") {
    return "min must be a number";
  }

  if (bothDefined && typeof max !== "number") {
    return "max must be a number";
  }

  return null;
}

export function wrapValidationResult(errors: string[]): ValidationResult {
  if (errors.length === 0) {
    return { isValid: true };
  }

  return { isValid: false, errors };
}
