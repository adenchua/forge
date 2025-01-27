import InvalidReferenceKeyError from "../errors/InvalidReferenceKeyError";

export function containsReferenceString(value: unknown): boolean {
  return String(value).startsWith("#ref.");
}

export function getReferenceValue(referenceString: string, reference: object) {
  const [, referenceKey] = referenceString.split("#ref.");
  const result = reference[referenceKey];
  if (result == null) {
    throw new InvalidReferenceKeyError();
  }

  return result;
}

export function parseReferenceValue<T>(value: T | string, reference: object): T {
  if (!containsReferenceString(value)) {
    return value as T;
  }

  // contains referenced value, return reference value instead
  return getReferenceValue(value as string, reference) as T;
}
