import { Schema, SchemaReference, SchemaValue } from "../interfaces/schema";
import { ValidationResult } from "../interfaces/validators";
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
    for (const [field, schemaValue] of Object.entries(this.schema)) {
      const { isValid, errors } = this.validateSchemaValue(schemaValue);

      if (!isValid) {
        this.isValid = false;
        console.error(`${field} in schema is invalid:`);
        errors?.forEach((error) => {
          console.error(error);
        });
      }
    }
  }

  private validateSchemaValue(schemaValue: SchemaValue): ValidationResult {
    return getSchemaValidationResult(schemaValue, this.reference);
  }
}
