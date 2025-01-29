export interface RelativeDateOptions {
  referenceKey: string;
  days: number;
}

export interface CopyOptions {
  referenceKey: string;
}

export interface StringInterpolationOptions {
  pattern: string;
  referenceKeys: string[];
}
