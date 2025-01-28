import { VALID_DERIVATIVE_TYPES } from "../constants";

export type Derivatives = Record<string, DerivativesValue>;

export interface DerivativesValue {
  type: DerivativesType;
  options?: unknown;
  isNullable?: boolean;
  nullablePercentage?: number;
}

export type DerivativesType = (typeof VALID_DERIVATIVE_TYPES)[number];
