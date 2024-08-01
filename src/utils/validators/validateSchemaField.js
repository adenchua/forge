import { checkObjectProperty } from "./validatorHelpers.js";

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
  "url-domain",
];

export function validateSchemaField(fieldName, schemaObject) {
  let flag = true;

  flag = checkObjectProperty(schemaObject, "type", fieldName);

  if (schemaObject != null && !VALID_TYPES.includes(schemaObject.type)) {
    console.error(`Invalid type '${schemaObject.type}' supplied for field: ${fieldName}`);
    flag = false;
  }

  return flag;
}
