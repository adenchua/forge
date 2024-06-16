import { isValid } from "date-fns";

import { validateCopy } from "./derivative-validators/validateCopy.js";
import { validateRelativeDate } from "./derivative-validators/validateRelativeDate.js";
import { validateStringInterpolation } from "./derivative-validators/validateStringInterpolation.js";
import { validateArray } from "./validateArray.js";
import { validateEnum } from "./validateEnum.js";
import { validateEnumArray } from "./validateEnumArray.js";
import { validateFile } from "./validateFile.js";
import { validateFirstName } from "./validateFirstName.js";
import { validateFloat } from "./validateFloat.js";
import { validateFormatString } from "./validateFormatString.js";
import { validateFullName } from "./validateFullName.js";
import { validateIsoTimestamp } from "./validateIsoTimestamp.js";
import { validateLastName } from "./validateLastName.js";
import { validateNumber } from "./validateNumber.js";
import { validateNumericString } from "./validateNumericString.js";
import { validateObject } from "./validateObject.js";
import { validateSocialMediaPost } from "./validateSocialMediaPost.js";
import { validateText } from "./validateText.js";
import { validateUrl } from "./validateUrl.js";

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
    default:
      console.error(`Invalid type '${type}' for field: ${fieldName}`);
      return false;
  }
}

export function isValidNonEmptyArray(value) {
  return value !== null && Array.isArray(value) && value.length > 0;
}

export function isNumber(value) {
  return typeof value === "number";
}

export function isBoolean(value) {
  return typeof value === "boolean";
}

export function isString(value) {
  return typeof value === "string";
}

export function checkReferenceValue(referenceString, references, fieldName) {
  const [, referenceKey] = referenceString.split("#ref.");
  if (!references.hasOwnProperty(referenceKey)) {
    console.error(`Invalid reference key '${referenceKey}' for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function checkObjectProperty(object, property, fieldName) {
  if (object == null) {
    console.error(`Missing 'options' property for field: ${fieldName}`);
    return false;
  }

  if (!object.hasOwnProperty(property)) {
    console.error(`Missing '${property}' property for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function checkBoolean(property, value, fieldName) {
  if (!isBoolean(value)) {
    console.error(`'${property}' must be a boolean type for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function checkNumber(property, value, fieldName) {
  if (!isNumber(value)) {
    console.error(`'${property}' provided is not a number for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function checkString(property, value, fieldName) {
  if (!isString(value)) {
    console.error(`'${property}' provided is not a string for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function checkNonEmptyArray(property, value, fieldName) {
  if (!isValidNonEmptyArray(value)) {
    console.error(`'${property}' must be a non-empty array for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function checkIfOneValueIsNull(property1, property2, value1, value2, fieldName) {
  if (value1 === undefined && value2 !== undefined) {
    console.error(`'${property2}' is provided but '${property1}' is null for field: ${fieldName}`);
    return false;
  }

  if (value1 !== undefined && value2 === undefined) {
    console.error(`'${property1}' is provided but '${property2}' is null for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function checkInvalidISODate(property, value, fieldName) {
  if (!isValid(new Date(value))) {
    console.error(`'${property}' is an invalid ISO8601 format for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function checkIfMinIsGreaterThanMax(min, max, fieldName) {
  if (min > max) {
    console.error(`'min' is greater than 'max' for field: ${fieldName}`);
    return false;
  }

  return true;
}
