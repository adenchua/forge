import {
  checkNonEmptyArray,
  checkObjectProperty,
  checkString,
  isString,
  isValidNonEmptyArray,
} from "./validatorHelpers.js";
import { validateSchemaField } from "./validateSchemaField.js";

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
