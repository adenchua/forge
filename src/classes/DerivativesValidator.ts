import InvalidDerivativesTypeError from "../errors/InvalidDerivativesTypeError";
import { Derivatives, DerivativesValue } from "../interfaces/derivatives";
import {
  CopyOptions,
  RelativeDateOptions,
  StringInterpolationOptions,
} from "../interfaces/derivativesOptions";
import { ValidationResult } from "../interfaces/validators";
import {
  validateCopy,
  validateDerivativesValue,
  validateRelativeDate,
  validateStringInterpolation,
} from "../utils/validators/derivative-validators";
import { wrapValidationResult } from "../utils/validators/validatorHelpers";

/**
 * Validates a derivatives object and log errors
 */
export default class DerivativesValidator {
  private derivatives: Derivatives;
  private reference: Record<string, unknown>;
  private isValid: boolean = true;

  constructor(derivatives: Derivatives, reference: Record<string, unknown>) {
    this.derivatives = derivatives;
    this.reference = reference;
  }

  getValidity() {
    return this.isValid;
  }

  validateDerivatives() {
    for (const [field, derivativesValue] of Object.entries(this.derivatives)) {
      const { isValid, errors } = this.validateDeriativesValue(derivativesValue);

      if (!isValid) {
        this.isValid = false;
        console.error(`${field} in schema is invalid:`);
        errors?.forEach((error) => {
          console.error(error);
        });
      }
    }
  }

  private validateDeriativesValue(derivativesValue: DerivativesValue): ValidationResult {
    const { type, options } = derivativesValue;

    const { isValid, errors } = validateDerivativesValue(derivativesValue);

    // provided derivatives type has error
    if (!isValid) {
      return wrapValidationResult(errors!);
    }

    switch (type) {
      case "string-interpolation":
        return validateStringInterpolation(options as StringInterpolationOptions, this.reference);
      case "copy":
        return validateCopy(options as CopyOptions, this.reference);
      case "date-before":
        return validateRelativeDate(options as RelativeDateOptions, this.reference);
      case "date-after":
        return validateRelativeDate(options as RelativeDateOptions, this.reference);
      default:
        throw new InvalidDerivativesTypeError();
    }
  }
}
