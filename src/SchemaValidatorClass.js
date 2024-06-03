import {
  validateArray,
  validateEnum,
  validateEnumArray,
  validateFile,
  validateFirstName,
  validateFloat,
  validateFormatString,
  validateFullName,
  validateIsoTimestamp,
  validateLastName,
  validateNumber,
  validateNumericString,
  validateObject,
  validateSchemaField,
  validateSocialMediaPost,
  validateText,
  validateUrl,
} from "./utils/validators/schemaValidator.js";

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
      const isValid = this.validateType(type, options, fieldName);
      if (!isValid) {
        this.#isValid = false;
      }
    }
  }

  validateType(type, options, fieldName) {
    switch (type) {
      case "enum":
        return validateEnum(fieldName, options, this.#references);
      case "enum-array":
        return validateEnumArray(fieldName, options, this.#references);
      case "iso-timestamp":
        return validateIsoTimestamp(fieldName, options, this.#references);
      case "text":
        return validateText(fieldName, options, this.#references);
      case "numeric-string":
        return validateNumericString(fieldName, options, this.#references);
      case "url":
        return validateUrl(fieldName, options);
      case "array":
        return validateArray(fieldName, options);
      case "number":
        return validateNumber(fieldName, options, this.#references);
      case "float":
        return validateFloat(fieldName, options, this.#references);
      case "first-name":
        return validateFirstName(fieldName, options);
      case "last-name":
        return validateLastName(fieldName, options);
      case "full-name":
        return validateFullName(fieldName, options);
      case "object":
        return validateObject(fieldName, options);
      case "file":
        return validateFile(fieldName, options);
      case "social-media-post":
        return validateSocialMediaPost(fieldName, options);
      case "format-string":
        return validateFormatString(fieldName, options);
      case "id":
        return true; // no need for validation since no user input
      default:
        console.error(`Invalid type ${type} for field: ${fieldName}`);
        return false;
    }
  }

  validateDerivatives() {}
}

export default SchemaValidator;
