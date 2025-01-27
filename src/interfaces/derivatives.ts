export type Derivatives = Record<string, DerivativesValue>;

export interface DerivativesValue {
  type: DerivativesType;
  options?: unknown;
  isNullable?: boolean;
  nullablePercentage?: number;
}

export type DerivativesType = "string-interpolation" | "copy" | "date-before" | "date-after";
