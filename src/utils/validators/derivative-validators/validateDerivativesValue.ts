import { ValidationResult } from "../../../interfaces/validators";
import { VALID_DERIVATIVE_TYPES } from "../../../constants";
import { DerivativesValue } from "../../../interfaces/derivatives";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateDerivativesValue(derivativesValue: DerivativesValue): ValidationResult {
  const errors: string[] = [];
  const { type, isNullable, nullablePercentage } = derivativesValue;

  const typeError = checkObjectProperty(derivativesValue, "type", ["string"]);
  if (typeError !== null) {
    errors.push(typeError);
  }

  if (!VALID_DERIVATIVE_TYPES.includes(type)) {
    errors.push(`Invalid type '${type}' supplied`);
  }

  if (isNullable != undefined) {
    const isNullableError = checkObjectProperty(derivativesValue, "isNullable", ["boolean"]);
    if (isNullableError != null) {
      errors.push(isNullableError);
    }
  }

  if (nullablePercentage != undefined) {
    const nullablePercentageError = checkObjectProperty(derivativesValue, "nullablePercentage", [
      "number",
    ]);
    if (nullablePercentageError != null) {
      errors.push(nullablePercentageError);
    }
  }

  // TODO: check whether options is provided for some compulsory ones

  return wrapValidationResult(errors);
}
