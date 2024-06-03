import { differenceInCalendarDays, isValid } from "date-fns";

import { containsReferenceString, getReferenceValue } from "../referenceUtils.js";

const VALID_TYPES = [
  "boolean",
  "enum",
  "enum-array",
  "iso-timestamp",
  "object",
  "text",
  "numeric-string",
  "url",
  "array",
  "number",
  "float",
  "username",
  "gender",
  "user-bio",
  "first-name",
  "last-name",
  "full-name",
  "email",
  "country",
  "country-code",
  "url-image",
  "file",
  "social-media-post",
  "id",
  "format-string",
];

export function validateType(type, options, fieldName, references) {
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
    default:
      console.error(`Invalid type '${type}' for field: ${fieldName}`);
      return false;
  }
}

function isValidNonEmptyArray(value) {
  return value !== null && Array.isArray(value) && value.length > 0;
}

function isNumber(value) {
  return typeof value === "number";
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isString(value) {
  return typeof value === "string";
}

function checkReferenceValue(referenceString, references, fieldName) {
  const [, referenceKey] = referenceString.split("#ref.");
  if (!references.hasOwnProperty(referenceKey)) {
    console.error(`Invalid reference key '${referenceKey}' for field: ${fieldName}`);
    return false;
  }

  return true;
}

function checkObjectProperty(object, property, fieldName) {
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

function checkBoolean(property, value, fieldName) {
  if (!isBoolean(value)) {
    console.error(`'${property}' must be a boolean type for field: ${fieldName}`);
    return false;
  }

  return true;
}

function checkNumber(property, value, fieldName) {
  if (!isNumber(value)) {
    console.error(`'${property}' provided is not a number for field: ${fieldName}`);
    return false;
  }

  return true;
}

function checkString(property, value, fieldName) {
  if (!isString(value)) {
    console.error(`'${property}' provided is not a string for field: ${fieldName}`);
    return false;
  }

  return true;
}

function checkNonEmptyArray(property, value, fieldName) {
  if (!isValidNonEmptyArray(value)) {
    console.error(`'${property}' must be a non-empty array for field: ${fieldName}`);
    return false;
  }

  return true;
}

function checkIfOneValueIsNull(property1, property2, value1, value2, fieldName) {
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

function checkInvalidISODate(property, value, fieldName) {
  if (!isValid(new Date(value))) {
    console.error(`'${property}' is an invalid ISO8601 format for field: ${fieldName}`);
    return false;
  }

  return true;
}

function checkIfMinIsGreaterThanMax(min, max, fieldName) {
  if (min > max) {
    console.error(`'min' is greater than 'max' for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function validateSchemaField(fieldName, schemaObject) {
  let flag = true;

  flag = checkObjectProperty(schemaObject, "type", fieldName);

  if (schemaObject != null && !VALID_TYPES.includes(schemaObject.type)) {
    console.error(`Invalid type '${schemaObject.type}' supplied for field: ${fieldName}`);
    flag = false;
  }

  return flag;
}

export function validateEnum(fieldName, options, references) {
  let flag = true;
  let enumOptions = options;

  if (containsReferenceString(options)) {
    flag = checkReferenceValue(options, references, fieldName) && flag;
    if (flag) {
      enumOptions = getReferenceValue(options, references);
    }
  }

  flag = checkNonEmptyArray("options", enumOptions, fieldName) && flag;

  return flag;
}

export function validateEnumArray(fieldName, options, references) {
  return validateEnum(fieldName, options, references);
}

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

export function validateText(fieldName, options, references) {
  let flag = true;
  let { min, max } = options || {};

  if (min === undefined && max === undefined) {
    return true; // no need to check further
  }

  flag = checkIfOneValueIsNull("min", "max", min, max, fieldName);

  if (containsReferenceString(min)) {
    flag = checkReferenceValue(min, references, fieldName) && flag;
    if (flag) {
      min = getReferenceValue(min, references);
    }
  }

  if (containsReferenceString(max)) {
    flag = checkReferenceValue(max, references, fieldName) && flag;
    if (flag) {
      max = getReferenceValue(max, references);
    }
  }

  flag = checkNumber("min", min, fieldName) && flag;
  flag = checkNumber("max", max, fieldName) && flag;

  return flag;
}

export function validateUrl(fieldName, options) {
  const { allowNumbers } = options || {};

  if (allowNumbers === undefined) {
    return true;
  }

  return checkBoolean("allowNumbers", allowNumbers, fieldName);
}

export function validateNumericString(fieldName, options, references) {
  let flag = true;
  let { min, max, allowLeadingZeros } = options || {};

  if (min === undefined && max === undefined && allowLeadingZeros === undefined) {
    return true;
  }

  flag = checkIfOneValueIsNull("min", "max", min, max, fieldName);

  if (containsReferenceString(min)) {
    flag = checkReferenceValue(min, references, fieldName) && flag;
    if (flag) {
      min = getReferenceValue(min, references);
    }
  }

  if (containsReferenceString(max)) {
    flag = checkReferenceValue(max, references, fieldName) && flag;
    if (flag) {
      max = getReferenceValue(max, references);
    }
  }

  if (allowLeadingZeros != null) {
    flag = checkBoolean("allowLeadingZeros", allowLeadingZeros, fieldName);
  }

  flag = checkNumber("min", min, fieldName) && flag;
  flag = checkNumber("max", max, fieldName) && flag;

  flag = checkIfMinIsGreaterThanMax(min, max, fieldName) && flag;

  return flag;
}

export function validateNumber(fieldName, options, references) {
  let flag = true;
  let { min, max } = options || {};

  if (min === undefined && max === undefined) {
    return true;
  }

  if (containsReferenceString(min)) {
    flag = checkReferenceValue(min, references, fieldName) && flag;
    if (flag) {
      min = getReferenceValue(min, references);
    }
  }

  if (containsReferenceString(max)) {
    flag = checkReferenceValue(max, references, fieldName) && flag;
    if (flag) {
      max = getReferenceValue(max, references);
    }
  }

  if (min != null) {
    flag = checkNumber("min", min, fieldName) && flag;
  }

  if (max != null) {
    flag = checkNumber("max", max, fieldName) && flag;
  }

  if (min != null && max != null) {
    flag = checkIfMinIsGreaterThanMax(min, max, fieldName) && flag;
  }

  return flag;
}

export function validateFloat(fieldName, options, references) {
  return validateNumber(fieldName, options, references);
}

export function validateFirstName(fieldName, options) {
  let { gender } = options || {};

  if (gender === undefined) {
    return true;
  }

  if (!["male", "female"].includes(gender)) {
    console.error(`gender supplied must be 'male' or 'female' for field: ${fieldName}`);
    return false;
  }

  return true;
}

export function validateLastName(fieldName, options) {
  return validateFirstName(fieldName, options);
}

export function validateFullName(fieldName, options) {
  return validateFirstName(fieldName, options);
}

export function validateArray(fieldName, options, references = {}) {
  let flag = true;
  const { schema, min, max } = options || {};
  const { type, options: schemaOptions } = schema || {};

  flag = checkObjectProperty(options, "schema", fieldName) && flag;
  flag = checkObjectProperty(options, "min", fieldName) && flag;
  flag = checkObjectProperty(options, "max", fieldName) && flag;

  flag = checkObjectProperty(schema, "type", fieldName) && flag;
  flag = validateType(type, schemaOptions, fieldName, references) && flag;

  flag = checkNumber("min", min, fieldName) && flag;
  flag = checkNumber("max", max, fieldName) && flag;
  flag = checkIfMinIsGreaterThanMax(min, max, fieldName) && flag;

  flag = flag && validateSchemaField(fieldName, schema) && flag;

  return flag;
}

export function validateFile(fieldName, options) {
  const { extension } = options || {};

  if (extension === undefined) {
    return true;
  }

  return checkString("extension", extension, fieldName);
}

export function validateSocialMediaPost(fieldName, options) {
  let flag = true;
  const { languages, min, max, hashtagPercentage, urlPercentage } = options || {};

  if (languages !== undefined) {
    flag = checkNonEmptyArray("languages", languages, fieldName) && flag;
  }

  if (min !== undefined) {
    flag = checkNumber("min", min, fieldName) && flag;
  }

  if (max !== undefined) {
    flag = checkNumber("min", min, fieldName) && flag;
  }

  if (hashtagPercentage !== undefined) {
    flag = checkNumber("hashtagPercentage", hashtagPercentage, fieldName) && flag;
  }

  if (urlPercentage !== undefined) {
    flag = checkNumber("urlPercentage", urlPercentage, fieldName) && flag;
  }

  if (min !== undefined && max !== undefined) {
    flag = checkIfMinIsGreaterThanMax(min, max, fieldName) && flag;
  }

  return flag;
}

export function validateObject(fieldName, options, references = {}) {
  let flag = true;
  const { properties } = options || {};

  flag = checkObjectProperty(options, "properties", fieldName) && flag;

  if (properties !== undefined) {
    flag = checkNonEmptyArray("properties", properties, fieldName) && flag;
  }

  if (properties !== undefined && isValidNonEmptyArray(properties)) {
    properties.forEach((property) => {
      flag = checkObjectProperty(property, "type", fieldName) && flag;
      flag = checkObjectProperty(property, "fieldName", fieldName) && flag;
      flag = validateType(property.type, property.options, fieldName, references) && flag;
    });
  }

  return flag;
}

export function validateFormatString(fieldName, options) {
  let flag = true;
  const { string, properties } = options || {};

  flag = checkObjectProperty(options, "string", fieldName) && flag;
  flag = checkObjectProperty(options, "properties", fieldName) && flag;
  flag = checkString("string", string, fieldName) && flag;
  flag = checkNonEmptyArray("properties", properties, fieldName) && flag;

  if (isString(string) && isValidNonEmptyArray(properties)) {
    const numberOfVariables = (string.match(/{}/g) || []).length;

    if (numberOfVariables !== properties.length) {
      console.error(
        `number of '{}' in string format does not match the number of properties for field: ${fieldName}`,
      );
      flag = false;
    }
  }

  if (isValidNonEmptyArray(properties)) {
    properties.forEach((property) => {
      flag = validateSchemaField(`${fieldName}.properties`, property) && flag;
      const { type } = property;

      if (
        type === "format-string" ||
        type === "enum-array" ||
        type === "array" ||
        type === "object"
      ) {
        console.error(`format-string does not support type: '${type}' for field: ${fieldName}`);
        flag = false;
      }
    });
  }

  return flag;
}

export default {};
