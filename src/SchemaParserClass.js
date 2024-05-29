import DerivativesParserClass from "./DerivativesParserClass.js";
import FakeDataGenerator from "./FakeDataGeneratorClass.js";
import { errorCodes } from "./utils/errorCodes.js";

class SchemaParser {
  #dataGenerator = new FakeDataGenerator();
  #derivativesParserClass = new DerivativesParserClass();
  #resultDocument = {};
  #schema = {};
  #calculatedValues = {};
  #nullablePercentage = 0;
  #references = {};

  constructor(schema, nullablePercentage, references, calculatedValues) {
    this.#schema = schema || {};
    this.#nullablePercentage = nullablePercentage;
    this.#references = references || {};
    this.#calculatedValues = calculatedValues || {};

    // builds the result document
    this.#initialize();
  }

  #containsReference(value) {
    return value != null && String(value).includes("#ref");
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

      this.#resultDocument[fieldName] = this.#parseSchemaType(
        type,
        isNullable,
        nullablePercentage,
        options,
      );
    }

    this.#processDerivatives(); // after writing values from schema, add calculated values
  }

  #processDerivatives() {
    if (this.#calculatedValues == null || Object.keys(this.#calculatedValues).length === 0) {
      return;
    }

    // deep clone the result document to ensure read-only
    const clonedResultDocument = JSON.parse(JSON.stringify(this.#resultDocument));

    for (const [fieldName, value] of Object.entries(this.#calculatedValues)) {
      const type = value.type;
      const isNullable = value.isNullable;
      const nullablePercentage = value.nullablePercentage;
      const options = value.options;

      this.#resultDocument[fieldName] = this.#parseDerivatives(
        type,
        isNullable,
        nullablePercentage,
        options,
        clonedResultDocument,
      );
    }
  }

  #isNullable(isNullable, nullablePercentage) {
    const _isNullable = isNullable || nullablePercentage || false;
    // if provided, override global nullablePercentage value
    const _nullablePercentage = nullablePercentage || this.#nullablePercentage;

    if (_isNullable) {
      // code that runs _nullablePercentage of the time
      if (Math.random() < _nullablePercentage) {
        return true;
      }
    }

    return false;
  }

  #parseDerivatives(type, isNullable, nullablePercentage, options, referenceObject) {
    if (this.#isNullable(isNullable, nullablePercentage)) {
      return null;
    }

    switch (type) {
      case "string-interpolation":
        return this.#derivativesParserClass.parseStringInterpolation(referenceObject, options);
      case "copy":
        return this.#derivativesParserClass.parseCopy(referenceObject, options);
      case "date-before":
        return this.#derivativesParserClass.parseRelativeDate(referenceObject, options, "before");
      case "date-after":
        return this.#derivativesParserClass.parseRelativeDate(referenceObject, options, "after");
      default:
        throw new Error(errorCodes.invalidDerivativesType);
    }
  }

  #parseSchemaType(type, isNullable, nullablePercentage, options) {
    if (this.#isNullable(isNullable, nullablePercentage)) {
      return null;
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
      result[fieldName] = this.#parseSchemaType(
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

    if (this.#containsReference(enumOptions)) {
      const referenceValue = this.#getReferenceValue(enumOptions);
      return this.#dataGenerator.generateEnum(referenceValue);
    }

    return this.#dataGenerator.generateEnum(enumOptions);
  }

  #getEnumArray(enumOptions) {
    if (enumOptions == null) {
      throw new Error(errorCodes.nullEnumOptionsError);
    }

    if (this.#containsReference(enumOptions)) {
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

    let df = dateFrom;
    let dt = dateTo;

    if (this.#containsReference(df)) {
      df = this.#getReferenceValue(dateFrom);
    }

    if (this.#containsReference(dt)) {
      dt = this.#getReferenceValue(dateTo);
    }

    return this.#dataGenerator.generateISOTimestamp(df, dt);
  }

  #getText(options) {
    const { min, max } = options || {};
    let minWordCount = min ?? 5;
    let maxWordCount = max ?? 120;

    if (this.#containsReference(minWordCount)) {
      minWordCount = this.#getReferenceValue(minWordCount);
    }

    if (this.#containsReference(maxWordCount)) {
      maxWordCount = this.#getReferenceValue(maxWordCount);
    }

    return this.#dataGenerator.generateText(minWordCount, maxWordCount);
  }

  #getUrl(options) {
    const { allowNumbers } = options || {};
    return this.#dataGenerator.generateURL(allowNumbers);
  }

  #getNumericString(options) {
    const { min, max, allowLeadingZeros } = options || {};
    let minLength = min;
    let maxLength = max;

    if (this.#containsReference(minLength)) {
      minLength = this.#getReferenceValue(minLength);
    }

    if (this.#containsReference(maxLength)) {
      maxLength = this.#getReferenceValue(maxLength);
    }

    return this.#dataGenerator.generateNumericString(minLength, maxLength, allowLeadingZeros);
  }

  #getNumber(options) {
    const { min, max } = options || {};
    let minNumber = min;
    let maxNumber = max;

    if (this.#containsReference(minNumber)) {
      minNumber = this.#getReferenceValue(minNumber);
    }

    if (this.#containsReference(maxNumber)) {
      maxNumber = this.#getReferenceValue(maxNumber);
    }

    return this.#dataGenerator.generateNumber(minNumber, maxNumber);
  }

  #getFloat(options) {
    const { min, max } = options || {};
    let minNumber = min;
    let maxNumber = max;

    if (this.#containsReference(minNumber)) {
      minNumber = this.#getReferenceValue(minNumber);
    }

    if (this.#containsReference(maxNumber)) {
      maxNumber = this.#getReferenceValue(maxNumber);
    }

    return this.#dataGenerator.generateFloat(minNumber, maxNumber);
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
      const item = this.#parseSchemaType(type, false, 0, schemaOptions);
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
