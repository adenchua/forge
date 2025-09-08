export const FORGE_VERSION_NUMBER = "1.2.3";

export const DEFAULT_MIN_WORD_LENGTH_OR_COUNT = 5;
export const DEFAULT_MAX_WORD_LENGTH_OR_COUNT = 120;

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
