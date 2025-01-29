export const MIN_COUNT = 5;
export const MAX_COUNT = 120;
export const VERSION_NUMBER = "1.2.0";

export const VALID_SCHEMA_TYPES = [
  "array",
  "boolean",
  "country",
  "country-code",
  "email",
  "enum",
  "enum-array",
  "format-string",
  "file",
  "first-name",
  "float",
  "full-name",
  "gender",
  "id",
  "iso-timestamp",
  "last-name",
  "number",
  "numeric-string",
  "object",
  "social-media-post",
  "text",
  "url",
  "url-domain",
  "url-image",
  "username",
  "user-bio",
] as const;

export const VALID_DERIVATIVE_TYPES = [
  "string-interpolation",
  "copy",
  "date-before",
  "date-after",
] as const;
