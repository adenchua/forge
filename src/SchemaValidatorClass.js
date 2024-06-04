import { validateSchemaField } from "./utils/validators/validateSchemaField.js";
import { validateType } from "./utils/validators/validatorHelpers.js";

class SchemaValidator {
  #schemaObject = null;
  #derivativesObject = null;
  #references = null;
  #isValid = true;

  constructor(schema, derivatives, references) {
    this.#schemaObject = schema;
    this.#derivativesObject = derivatives;
    this.#references = references;
  }

  getValidity() {
    return this.#isValid;
  }

  validateSchema() {
    for (const [fieldName, value] of Object.entries(this.#schemaObject)) {
      validateSchemaField(fieldName, value);
      const { type, options } = value;
      const isValid = validateType(type, options, fieldName, this.#references);
      // once false do not change to true since one of the schema property is invalid
      if (this.#isValid) {
        this.#isValid = isValid;
      }
    }
  }

  validateDerivatives() {}
}

export default SchemaValidator;
