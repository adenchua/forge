import { validateSchemaField } from "./validateSchemaField";
import {
  checkIfMinIsGreaterThanMax,
  checkNumber,
  checkObjectProperty,
  validateSchemaType,
} from "./validatorHelpers";

export function validateArray(fieldName, options, references = {}) {
  let flag = true;
  const { schema, min, max } = options || {};
  const { type, options: schemaOptions } = schema || {};

  flag = checkObjectProperty(options, "schema", fieldName) && flag;
  flag = checkObjectProperty(options, "min", fieldName) && flag;
  flag = checkObjectProperty(options, "max", fieldName) && flag;

  flag = checkObjectProperty(schema, "type", fieldName) && flag;
  flag = validateSchemaType(type, schemaOptions, fieldName, references) && flag;

  flag = checkNumber("min", min, fieldName) && flag;
  flag = checkNumber("max", max, fieldName) && flag;
  flag = checkIfMinIsGreaterThanMax(min, max, fieldName) && flag;

  flag = flag && validateSchemaField(fieldName, schema) && flag;

  return flag;
}
