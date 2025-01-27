export type Schema = Record<string, SchemaValue>;

export interface SchemaValue {
  type: SchemaType;
  isNullable?: boolean;
  nullablePercentage?: number;
  options?: unknown;
}

export type SchemaType =
  | "array"
  | "boolean"
  | "country"
  | "country-code"
  | "email"
  | "enum"
  | "enum-array"
  | "format-string"
  | "file"
  | "first-name"
  | "float"
  | "full-name"
  | "gender"
  | "id"
  | "iso-timestamp"
  | "last-name"
  | "number"
  | "numeric-string"
  | "object"
  | "social-media-post"
  | "text"
  | "url"
  | "url-domain"
  | "url-image"
  | "username"
  | "user-bio";
