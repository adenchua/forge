import InvalidSchemaTypeError from "../errors/InvalidSchemaTypeError";
import { Schema, SchemaValue } from "../interfaces/schema";
import {
  ArrayOption,
  DateRangeOption,
  FileOption,
  FormatStringOption,
  GenderOption,
  MinMaxOption,
  NumericStringOption,
  ObjectOption,
  SocialMediaPostOption,
  UrlOption,
} from "../interfaces/schemaOptions";
import { ValidationResult } from "../interfaces/validators";
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
  validateSchemaValue,
  validateSocialMediaPost,
  validateText,
  validateUrl,
} from "../utils/validators/schema-validators";
import { wrapValidationResult } from "../utils/validators/validatorHelpers";

/**
 * Validates a schema object and log errors
 */
export default class SchemaValidator {
  private schema: Schema;
  private reference: Record<string, any>;
  private isValid: boolean = true;

  constructor(schema: Schema, reference: Record<string, any>) {
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
    const { type, options } = schemaValue;

    const { isValid, errors } = validateSchemaValue(schemaValue);

    // provided schema type has error
    if (!isValid) {
      return wrapValidationResult(errors!);
    }

    switch (type) {
      case "enum":
        return validateEnum(options as string[] | string, this.reference);
      case "enum-array":
        return validateEnumArray(options as string[] | string, this.reference);
      case "iso-timestamp":
        return validateIsoTimestamp(options as DateRangeOption, this.reference);
      case "text":
        return validateText(options as MinMaxOption, this.reference);
      case "numeric-string":
        return validateNumericString(options as NumericStringOption, this.reference);
      case "url":
        return validateUrl(options as UrlOption);
      case "array":
        return validateArray(options as ArrayOption);
      case "number":
        return validateNumber(options as MinMaxOption, this.reference);
      case "float":
        return validateFloat(options as MinMaxOption, this.reference);
      case "first-name":
        return validateFirstName(options as GenderOption);
      case "last-name":
        return validateLastName(options as GenderOption);
      case "full-name":
        return validateFullName(options as GenderOption);
      case "object":
        return validateObject(options as ObjectOption);
      case "file":
        return validateFile(options as FileOption);
      case "social-media-post":
        return validateSocialMediaPost(options as SocialMediaPostOption);
      case "format-string":
        return validateFormatString(options as FormatStringOption);
      case "id":
        return wrapValidationResult([]); // no need for validation since no user input
      case "boolean":
        return wrapValidationResult([]);
      case "email":
        return wrapValidationResult([]);
      case "country":
        return wrapValidationResult([]);
      case "country-code":
        return wrapValidationResult([]);
      case "url-image":
        return wrapValidationResult([]);
      case "username":
        return wrapValidationResult([]);
      case "gender":
        return wrapValidationResult([]);
      case "user-bio":
        return wrapValidationResult([]);
      case "url-domain":
        return wrapValidationResult([]);
      default:
        throw new InvalidSchemaTypeError();
    }
  }
}
