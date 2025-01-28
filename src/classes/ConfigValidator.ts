import { validateDerivativeField } from "../utils/validators/derivative-validators/validateDerivativesValue";
import { validateSchemaField } from "../utils/validators/validateSchemaField";
import { validateDerivativeType, validateSchemaType } from "../utils/validators/validatorHelpers";

export default class ConfigValidator {
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
      // TODO: is there a need for this check? boolean not assigned
      validateSchemaField(fieldName, value);
      const { type, options } = value;
      const isValid = validateSchemaType(type, options, fieldName, this.#references);
      // once false do not change to true since one of the schema property is invalid
      if (this.#isValid) {
        this.#isValid = isValid;
      }
    }
  }

  validateDerivatives() {
    for (const [fieldName, value] of Object.entries(this.#derivativesObject)) {
      validateDerivativeField(fieldName, value);
      const { type, options } = value;
      const isValid = validateDerivativeType(type, options, fieldName, this.#schemaObject);
      // once false do not change to true since one of the schema property is invalid
      if (this.#isValid) {
        this.#isValid = isValid;
      }
    }
  }
}
