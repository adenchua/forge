import InvalidReferenceKeyError from "../errors/InvalidReferenceKeyError";

export function containsReferenceString(value: unknown): boolean {
  return String(value).startsWith("#ref.");
}

export function getReferenceValue<T>(referenceString: string, reference: Record<string, any>): T {
  const [, referenceKey] = referenceString.split("#ref.");
  const result = reference[referenceKey];
  if (result == null) {
    throw new InvalidReferenceKeyError();
  }

  return result;
}

export function parseReferenceValue<T>(value: T | string, reference: Record<string, any>): T {
  if (!containsReferenceString(value)) {
    return value as T;
  }

  // contains referenced value, return reference value instead
  return getReferenceValue(value as string, reference) as T;
}
