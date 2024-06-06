import FakeDataGenerator from "./FakeDataGeneratorClass.js";
import { errorCodes } from "./utils/errorCodes.js";
import { containsReferenceString, getReferenceValue } from "./utils/referenceUtils.js";

class SchemaParser {
  #dataGenerator = new FakeDataGenerator();
  #globalNullablePercentage = 0;

  constructor(nullablePercentage) {
    this.#globalNullablePercentage = nullablePercentage;
  }

  #isNullable(isNullable, nullablePercentage) {
    const _isNullable = isNullable || !!nullablePercentage || false;
    // if provided, override global nullablePercentage value
    const _nullablePercentage = nullablePercentage || this.#globalNullablePercentage;

    if (_isNullable) {
      // code that runs _nullablePercentage of the time
      if (Math.random() < _nullablePercentage) {
        return true;
      }
    }

    return false;
  }

  parseSchemaType(type, isNullable, nullablePercentage, options, references = {}) {
    if (this.#isNullable(isNullable, nullablePercentage)) {
      return null;
    }

    switch (type) {
      case "boolean":
        return this.getBoolean();
      case "enum":
        return this.getEnum(options, references);
      case "enum-array":
        return this.getEnumArray(options, references);
      case "iso-timestamp":
        return this.getIsoTimestamp(options, references);
      case "object":
        return this.getObject(options, references);
      case "text":
        return this.getText(options, references);
      case "numeric-string":
        return this.getNumericString(options, references);
      case "url":
        return this.getUrl(options);
      case "array":
        return this.getArray(options, references);
      case "number":
        return this.getNumber(options, references);
      case "float":
        return this.getFloat(options, references);
      case "username":
        return this.getPersonUsername();
      case "gender":
        return this.getPersonGender();
      case "user-bio":
        return this.getPersonBio();
      case "first-name":
        return this.getPersonFirstName(options);
      case "last-name":
        return this.getPersonLastName(options);
      case "full-name":
        return this.getPersonFullName(options);
      case "email":
        return this.getEmail();
      case "country":
        return this.getCountry();
      case "country-code":
        return this.getCountryCode();
      case "url-image":
        return this.getImageUrl();
      case "file":
        return this.getFile(options);
      case "social-media-post":
        return this.getSocialMediaPost(options);
      case "id":
        return this.getId();
      case "format-string":
        return this.getFormattedString(options, references);
      default:
        throw new Error(errorCodes.invalidType);
    }
  }

  getObject(options, references) {
    const { properties } = options;
    const result = {};

    for (let property of properties) {
      const {
        fieldName,
        type,
        isNullable: propertyIsNullable,
        nullablePercentage: propertyNullablePercentage,
        options: propertyOptions,
      } = property;
      result[fieldName] = this.parseSchemaType(
        type,
        propertyIsNullable,
        propertyNullablePercentage,
        propertyOptions,
        references,
      );
    }

    return result;
  }

  getBoolean() {
    return this.#dataGenerator.generateBoolean();
  }

  getEnum(enumOptions, references) {
    if (enumOptions == null) {
      throw new Error(errorCodes.nullEnumOptionsError);
    }

    if (containsReferenceString(enumOptions)) {
      const referenceValue = getReferenceValue(enumOptions, references);
      return this.#dataGenerator.generateEnum(referenceValue);
    }

    return this.#dataGenerator.generateEnum(enumOptions);
  }

  getEnumArray(enumOptions, references) {
    if (enumOptions == null) {
      throw new Error(errorCodes.nullEnumOptionsError);
    }

    if (containsReferenceString(enumOptions)) {
      const referenceValue = getReferenceValue(enumOptions, references);
      return this.#dataGenerator.generateEnumArray(referenceValue);
    }
    return this.#dataGenerator.generateEnumArray(enumOptions);
  }

  getIsoTimestamp(options, references) {
    const { dateFrom, dateTo } = options || {};
    const missingDateFrom = dateFrom == null && dateTo != null;
    const missingDateTo = dateFrom != null && dateTo == null;

    if (missingDateFrom || missingDateTo) {
      throw new Error(errorCodes.invalidDateRange);
    }

    let df = dateFrom;
    let dt = dateTo;

    if (containsReferenceString(df)) {
      df = getReferenceValue(dateFrom, references);
    }

    if (containsReferenceString(dt)) {
      dt = getReferenceValue(dateTo, references);
    }

    return this.#dataGenerator.generateISOTimestamp(df, dt);
  }

  getText(options, references) {
    const { min, max } = options || {};
    let minWordCount = min ?? 5;
    let maxWordCount = max ?? 120;

    if (containsReferenceString(minWordCount)) {
      minWordCount = getReferenceValue(minWordCount, references);
    }

    if (containsReferenceString(maxWordCount)) {
      maxWordCount = getReferenceValue(maxWordCount, references);
    }

    return this.#dataGenerator.generateText(minWordCount, maxWordCount);
  }

  getUrl(options) {
    const { allowNumbers } = options || {};
    return this.#dataGenerator.generateURL(allowNumbers);
  }

  getNumericString(options, references) {
    const { min, max, allowLeadingZeros } = options || {};
    let minLength = min;
    let maxLength = max;

    if (containsReferenceString(minLength)) {
      minLength = getReferenceValue(minLength, references);
    }

    if (containsReferenceString(maxLength)) {
      maxLength = getReferenceValue(maxLength, references);
    }

    return this.#dataGenerator.generateNumericString(minLength, maxLength, allowLeadingZeros);
  }

  getNumber(options, references) {
    const { min, max } = options || {};
    let minNumber = min;
    let maxNumber = max;

    if (containsReferenceString(minNumber)) {
      minNumber = getReferenceValue(minNumber, references);
    }

    if (containsReferenceString(maxNumber)) {
      maxNumber = getReferenceValue(maxNumber, references);
    }

    return this.#dataGenerator.generateNumber(minNumber, maxNumber);
  }

  getFloat(options, references) {
    const { min, max } = options || {};
    let minNumber = min;
    let maxNumber = max;

    if (containsReferenceString(minNumber)) {
      minNumber = getReferenceValue(minNumber, references);
    }

    if (containsReferenceString(maxNumber)) {
      maxNumber = getReferenceValue(maxNumber, references);
    }

    return this.#dataGenerator.generateFloat(minNumber, maxNumber);
  }

  getPersonUsername() {
    return this.#dataGenerator.generatePersonUsername();
  }

  getPersonGender() {
    return this.#dataGenerator.generatePersonGender();
  }

  getPersonBio() {
    return this.#dataGenerator.generatePersonBio();
  }

  getPersonFirstName(options) {
    const { gender } = options || {};
    return this.#dataGenerator.generatePersonFirstName(gender);
  }

  getPersonLastName(options) {
    const { gender } = options || {};
    return this.#dataGenerator.generatePersonLastName(gender);
  }

  getPersonFullName(options) {
    const { gender } = options || {};
    return this.#dataGenerator.generatePersonFullName(gender);
  }

  getEmail() {
    return this.#dataGenerator.generateEmail();
  }

  getCountry() {
    return this.#dataGenerator.generateCountry();
  }

  getCountryCode() {
    return this.#dataGenerator.generateCountryCode();
  }

  getArray(options, references) {
    const result = [];
    const { schema, min, max } = options || {};
    if (schema == null) {
      throw new Error(errorCodes.invalidArraySchema);
    }

    if (min === null || max === null) {
      throw new Error(errorCodes.invalidMinMax);
    }

    const { type, options: schemaOptions } = schema;
    const numberOfItems = Math.floor(Math.random() * (max - min + 1) + min);

    for (let i = 0; i < numberOfItems; i++) {
      const item = this.parseSchemaType(type, false, 0, schemaOptions, references);
      result.push(item);
    }

    return result;
  }

  getImageUrl() {
    return this.#dataGenerator.generateImageUrl();
  }

  getFile(options) {
    const { extension } = options || {};

    return this.#dataGenerator.generateFile(extension);
  }

  getSocialMediaPost(options) {
    const { languages = ["EN"], min, max, hashtagPercentage, urlPercentage } = options || {};

    if (languages === null) {
      throw new Error(errorCodes.nullLanguageError);
    }

    if (languages.length === 0) {
      throw new Error(errorCodes.emptyLanguagesError);
    }

    const selectedLanguage = this.#dataGenerator.generateEnum(languages);

    return this.#dataGenerator.generateSocialMediaPost(
      selectedLanguage,
      min,
      max,
      hashtagPercentage,
      urlPercentage,
    );
  }

  getId() {
    return this.#dataGenerator.generateId();
  }

  getFormattedString(options, references) {
    const { string, properties } = options || {};
    let result = string;

    for (let property of properties) {
      const { type, options: propertyOptions } = property;

      if (
        type === "format-string" ||
        type === "enum-array" ||
        type === "array" ||
        type === "object"
      ) {
        throw new Error(errorCodes.unsupportedFormatStringError);
      }

      const value = this.parseSchemaType(type, false, 0, propertyOptions, references);
      result = result.replace("{}", value);
    }

    return result;
  }
}

export default SchemaParser;
