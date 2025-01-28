import { Schema, SchemaValue } from "../interfaces/schema";

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

/**
 * Validates a schema object and log errors
 */
export default class SchemaValidator {
  private schema: Schema;
  private references: Record<string, any>;

  private isValid: boolean = true;

  constructor(schema: Schema, references: Record<string, any>) {
    this.schema = schema;
    this.references = references;
  }

  getValidity() {
    return this.isValid;
  }

  validateSchema() {
    for (const [field, schemaValue] of Object.entries(this.schema)) {
      const { isValid, errors } = this.validateSchemaValue(schemaValue);

      if (!isValid) {
        this.isValid = false;
        console.error(`${field} in schema is invalid`);
      }
    }
  }

  private validateSchemaValue(schemaValue: SchemaValue): ValidationResult {
    const { type, options } = schemaValue;
  }
}
