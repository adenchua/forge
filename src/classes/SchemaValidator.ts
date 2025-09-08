import { Schema, SchemaReference } from "../interfaces/schema";
import { getSchemaValidationResult } from "../utils/validators/validatorHelpers";

/**
 * Validates a schema object and log errors
 */
export default class SchemaValidator {
  private schema: Schema;
  private reference: SchemaReference;
  private isValid: boolean = true;

  constructor(schema: Schema, reference: SchemaReference) {
    this.schema = schema;
    this.reference = reference;
  }

  getValidity() {
    return this.isValid;
  }

  validateSchema() {
    for (const [key, value] of Object.entries(this.schema)) {
      const { isValid, errors } = getSchemaValidationResult(value, this.reference);

      if (!isValid) {
        this.isValid = false;
        console.error(`Property '${key}' in schema is invalid:`);
        errors?.forEach((error) => {
          console.error(error);
        });
      }
    }
  }
}
