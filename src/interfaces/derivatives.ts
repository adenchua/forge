import { VALID_DERIVATIVE_TYPES } from "../constants";

export type Derivatives = Record<string, DerivativesValue>;

export type DerivativesValue = {
  type: DerivativesType;
  options?: unknown;
  isNullable?: boolean;
  nullablePercentage?: number;
};

export type DerivativesType = (typeof VALID_DERIVATIVE_TYPES)[number];
