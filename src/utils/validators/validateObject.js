import {
  checkNonEmptyArray,
  checkObjectProperty,
  isValidNonEmptyArray,
  validateType,
} from "./validatorHelpers.js";

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
      flag =
        validateType(property.type, `${fieldName}.${property.options}`, fieldName, references) &&
        flag;
    });
  }

  return flag;
}
