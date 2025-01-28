import { VALID_SCHEMA_TYPES } from "../constants";

export type Schema = Record<string, SchemaValue>;

export interface SchemaValue {
  type: SchemaType;
  isNullable?: boolean;
  nullablePercentage?: number;
  options?: unknown;
}

export type SchemaType = (typeof VALID_SCHEMA_TYPES)[number];
