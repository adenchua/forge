import { ValidationResult } from "../../../classes/SchemaValidator";
import { VALID_DERIVATIVE_TYPES } from "../../../constants";
import { DerivativesValue } from "../../../interfaces/derivatives";
import { checkObjectProperty, wrapValidationResult } from "../validatorHelpers";

export function validateDerivativesValue(derivativesValue: DerivativesValue): ValidationResult {
  const errors: string[] = [];
  const { type, isNullable, nullablePercentage } = derivativesValue;

  const typeError = checkObjectProperty(derivativesValue, "type", ["string"]);
  typeError && errors.push(typeError);

  if (!VALID_DERIVATIVE_TYPES.includes(type)) {
    errors.push(`Invalid type '${type}' supplied`);
  }

  if (isNullable != undefined) {
    const isNullableError = checkObjectProperty(derivativesValue, "isNullable", ["boolean"]);
    isNullableError && errors.push(isNullableError);
  }

  if (nullablePercentage != undefined) {
    const nullablePercentageError = checkObjectProperty(derivativesValue, "nullablePercentage", [
      "number",
    ]);
    nullablePercentageError && errors.push(nullablePercentageError);
  }

  // TODO: check whether options is provided for some compulsory ones

  return wrapValidationResult(errors);
}
