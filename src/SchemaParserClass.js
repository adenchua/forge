import FakeDataGenerator from "./FakeDataGeneratorClass.js";
import { errorCodes } from "./utils/errorCodes.js";

class SchemaParser {
  #dataGenerator = new FakeDataGenerator();
  #resultDocument = {};
  #schema = null;
  #nullablePercentage = 0;
  #references = {};

  constructor(schema, nullablePercentage, references) {
    this.#schema = schema;
    this.#nullablePercentage = nullablePercentage;
    this.#references = references || {};

    // builds the result document
    this.#initialize();
  }

  #getReferenceValue(referenceString) {
    const [, referenceKey] = referenceString.split("#ref.");
    const result = this.#references[referenceKey];
    if (result == null) {
      throw new Error(errorCodes.invalidReferenceKey);
    }

    return result;
  }

  #initialize() {
    for (const [fieldName, value] of Object.entries(this.#schema)) {
      const type = value.type;
      const isNullable = value.isNullable;
      const nullablePercentage = value.nullablePercentage;
      const options = value.options;

      this.#resultDocument[fieldName] = this.#parseType(
        type,
        isNullable,
        nullablePercentage,
        options,
      );
    }
  }

  #parseType(type, isNullable, nullablePercentage, options) {
    const _isNullable = isNullable || nullablePercentage || false;
    // if provided, override global nullablePercentage value
    const _nullablePercentage = nullablePercentage || this.#nullablePercentage;

    if (_isNullable) {
      // code that runs _nullablePercentage of the time
      if (Math.random() < _nullablePercentage) {
        return null;
      }
    }

    switch (type) {
      case "boolean":
        return this.#getBoolean();
      case "enum":
        return this.#getEnum(options);
      case "enum-array":
        return this.#getEnumArray(options);
      case "iso-timestamp":
        return this.#getIsoTimestamp(options);
      case "object":
        return this.#getObject(options);
      case "text":
        return this.#getText(options);
      case "numeric-string":
        return this.#getNumericString(options);
      case "url":
        return this.#getUrl(options);
      case "array":
        return this.#getArray(options);
      case "number":
        return this.#getNumber(options);
      case "float":
        return this.#getFloat(options);
      case "username":
        return this.#getPersonUsername();
      case "gender":
        return this.#getPersonGender();
      case "user-bio":
        return this.#getPersonBio();
      case "first-name":
        return this.#getPersonFirstName(options);
      case "last-name":
        return this.#getPersonLastName(options);
      case "full-name":
        return this.#getPersonFullName(options);
      case "email":
        return this.#getEmail();
      case "country":
        return this.#getCountry();
      case "country-code":
        return this.#getCountryCode();
      case "url-image":
        return this.#getImageUrl();
      case "file":
        return this.#getFile(options);
      case "social-media-post":
        return this.#getSocialMediaPost(options);
      case "id":
        return this.#getId();
      default:
        throw new Error(errorCodes.invalidType);
    }
  }

  #getObject(options) {
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
      result[fieldName] = this.#parseType(
        type,
        propertyIsNullable,
        propertyNullablePercentage,
        propertyOptions,
      );
    }

    return result;
  }

  #getBoolean() {
    return this.#dataGenerator.generateBoolean();
  }

  #getEnum(enumOptions) {
    if (enumOptions == null) {
      throw new Error(errorCodes.nullEnumOptionsError);
    }

    if (enumOptions.includes("#ref")) {
      const referenceValue = this.#getReferenceValue(enumOptions);
      return this.#dataGenerator.generateEnum(referenceValue);
    }

    return this.#dataGenerator.generateEnum(enumOptions);
  }

  #getEnumArray(enumOptions) {
    if (enumOptions == null) {
      throw new Error(errorCodes.nullEnumOptionsError);
    }

    if (enumOptions.includes("#ref")) {
      const referenceValue = this.#getReferenceValue(enumOptions);
      return this.#dataGenerator.generateEnumArray(referenceValue);
    }
    return this.#dataGenerator.generateEnumArray(enumOptions);
  }

  #getIsoTimestamp(options) {
    const { dateFrom, dateTo } = options || {};
    const missingDateFrom = dateFrom == null && dateTo != null;
    const missingDateTo = dateFrom != null && dateTo == null;

    if (missingDateFrom || missingDateTo) {
      throw new Error(errorCodes.invalidDateRange);
    }

    return this.#dataGenerator.generateISOTimestamp(dateFrom, dateTo);
  }

  #getText(options) {
    const { min, max } = options || {};
    const minWordCount = min ?? 5;
    const maxWordCount = max ?? 120;

    return this.#dataGenerator.generateText(minWordCount, maxWordCount);
  }

  #getUrl(options) {
    const { allowNumbers } = options || {};
    return this.#dataGenerator.generateURL(allowNumbers);
  }

  #getNumericString(options) {
    const { min, max, allowLeadingZeros } = options || {};
    return this.#dataGenerator.generateNumericString(min, max, allowLeadingZeros);
  }

  #getNumber(options) {
    const { min, max } = options || {};
    return this.#dataGenerator.generateNumber(min, max);
  }

  #getFloat(options) {
    const { min, max } = options || {};
    return this.#dataGenerator.generateFloat(min, max);
  }

  #getPersonUsername() {
    return this.#dataGenerator.generatePersonUsername();
  }

  #getPersonGender() {
    return this.#dataGenerator.generatePersonGender();
  }

  #getPersonBio() {
    return this.#dataGenerator.generatePersonBio();
  }

  #getPersonFirstName(options) {
    const { gender } = options || {};
    return this.#dataGenerator.generatePersonFirstName(gender);
  }

  #getPersonLastName(options) {
    const { gender } = options || {};
    return this.#dataGenerator.generatePersonLastName(gender);
  }

  #getPersonFullName(options) {
    const { gender } = options || {};
    return this.#dataGenerator.generatePersonFullName(gender);
  }

  #getEmail() {
    return this.#dataGenerator.generateEmail();
  }

  #getCountry() {
    return this.#dataGenerator.generateCountry();
  }

  #getCountryCode() {
    return this.#dataGenerator.generateCountryCode();
  }

  #getArray(options) {
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
      const item = this.#parseType(type, false, 0, schemaOptions);
      result.push(item);
    }

    return result;
  }

  #getImageUrl() {
    return this.#dataGenerator.generateImageUrl();
  }

  #getFile(options) {
    const { extension } = options || {};

    return this.#dataGenerator.generateFile(extension);
  }

  #getSocialMediaPost(options) {
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

  #getId() {
    return this.#dataGenerator.generateId();
  }

  getDocument() {
    return this.#resultDocument;
  }
}

export default SchemaParser;
