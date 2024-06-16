import {
  checkNonEmptyArray,
  checkObjectProperty,
  isValidNonEmptyArray,
  validateSchemaType,
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
        validateSchemaType(
          property.type,
          property.options,
          `${fieldName}.${property.fieldName}`,
          references,
        ) && flag;
    });
  }

  return flag;
}
