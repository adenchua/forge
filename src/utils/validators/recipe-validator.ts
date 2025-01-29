import DerivativesValidator from "../../classes/DerivativesValidator";
import SchemaValidator from "../../classes/SchemaValidator";
import { Derivatives } from "../../interfaces/derivatives";
import { Schema } from "../../interfaces/schema";

export function isValidRecipe(
  schema?: Schema,
  derivatives?: Derivatives,
  reference?: Record<string, any>,
): boolean {
  if (schema == undefined) {
    console.error("schema must be provided");
    return false;
  }

  if (derivatives == undefined) {
    console.error("derivatives must be provided, or left as an empty object");
    return false;
  }

  if (reference == undefined) {
    console.error("references must be provided, or left as an empty object");
    return false;
  }

  const schemaValidator = new SchemaValidator(schema, reference);
  const derivativesValidator = new DerivativesValidator(derivatives, schema);

  schemaValidator.validateSchema();
  derivativesValidator.validateDerivatives();

  const schemaValid = schemaValidator.getValidity();
  const derivativesValid = derivativesValidator.getValidity();

  return schemaValid && derivativesValid;
}
