import { errorCodes } from "./errorCodes";

export function containsReferenceString(value) {
  return value != null && String(value).startsWith("#ref.");
}

export function getReferenceValue(referenceString, reference) {
  if (referenceString == null) {
    return;
  }
  const [, referenceKey] = referenceString.split("#ref.");
  const result = reference[referenceKey];
  if (result == null) {
    throw new Error(errorCodes.invalidReferenceKey);
  }

  return result;
}
