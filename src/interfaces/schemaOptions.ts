import { Schema, SchemaValue } from "./schema";

export type Gender = "male" | "female";

export type Language = "EN" | "DE" | "FR" | "CN" | "KO";

type ReferenceString = string;

export interface SocialMediaPostOption {
  languages?: Language[];
  min?: number;
  max?: number;
  hashtagPercentage?: number;
  urlPercentage?: number;
}

export const FORMAT_STRING_ALLOWED_TYPES: Array<SchemaValue["type"]> = [
  "boolean",
  "country",
  "country-code",
  "email",
  "enum",
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
  "url",
  "url-domain",
  "url-image",
  "username",
] as const;

export type FormatStringAllowedTypes = (typeof FORMAT_STRING_ALLOWED_TYPES)[number];

export interface FormatStringOption {
  pattern: string;
  properties: Array<{
    type: FormatStringAllowedTypes;
    options?: SchemaValue["options"];
  }>;
}

export interface FileOption {
  extension?: string;
}

export interface ObjectOption {
  properties: Schema;
}

export interface ArrayOption {
  schema: SchemaValue;
  min: number;
  max: number;
}

export interface GenderOption {
  gender?: Gender;
}

export interface NumericStringOption extends MinMaxOption {
  allowLeadingZeros?: boolean;
}

export interface UrlOption {
  allowNumbers?: boolean;
}

export interface MinMaxOption {
  min?: number | ReferenceString;
  max?: number | ReferenceString;
}

export interface DateRangeOption {
  dateFrom?: string | ReferenceString;
  dateTo?: string | ReferenceString;
}
