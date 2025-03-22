import assert from "node:assert";

import { MAX_COUNT, MIN_COUNT } from "../constants";
import InvalidDateRangeError from "../errors/InvalidDateRangeError";
import InvalidSchemaTypeError from "../errors/InvalidSchemaTypeError";
import { Schema, SchemaReference, SchemaValue } from "../interfaces/schema";
import {
  ArrayOption,
  DateRangeOption,
  FileOption,
  FormatStringOption,
  GenderOption,
  Language,
  MinMaxOption,
  NumericStringOption,
  ObjectOption,
  SocialMediaPostOption,
  UrlOption,
} from "../interfaces/schemaOptions";
import { randomIntFromInterval } from "../utils/mathRandomUtils";
import { parseReferenceValue } from "../utils/referenceUtils";
import FakeDataGenerator from "./FakeDataGenerator";

export default class SchemaParser {
  private fakeDataGenerator: FakeDataGenerator;
  private schema: Schema;
  private globalNullablePercentage: number = 0;
  private references: SchemaReference;
  private outputDocument: Record<string, unknown> = {};

  constructor(schema: Schema, globalNullablePercentage: number, references: SchemaReference) {
    this.schema = schema;
    this.globalNullablePercentage = globalNullablePercentage;
    this.references = references;
    this.fakeDataGenerator = new FakeDataGenerator();
  }

  parse() {
    // process each field of the schema, populate outputDocument
    for (const [field, schemaValue] of Object.entries(this.schema)) {
      this.outputDocument[field] = this.processSchemaValue(schemaValue);
    }
  }

  getOutput() {
    return this.outputDocument;
  }

  private isNull(nullablePercentage?: number): boolean {
    let finalNullablePercentage = this.globalNullablePercentage;

    if (nullablePercentage !== undefined) {
      finalNullablePercentage = nullablePercentage;
    }

    return Math.random() < finalNullablePercentage;
  }

  /** Process a schema value and returns the generated */
  private processSchemaValue(schemaValue: SchemaValue) {
    const { type, isNullable, nullablePercentage, options = {} } = schemaValue;

    if (isNullable && this.isNull(nullablePercentage)) {
      return null;
    }

    switch (type) {
      case "boolean":
        return this.getBoolean();
      case "enum":
        assert(options != undefined, "enum type options is not provided");
        return this.getEnum(options as string | unknown[]);
      case "enum-array":
        assert(options != undefined, "enum-array type options is not provided");
        return this.getEnumArray(options as string | unknown[]);
      case "iso-timestamp":
        return this.getIsoTimestamp(options as DateRangeOption);
      case "object":
        assert(options != undefined, "object type options is not provided");
        return this.getObject(options as ObjectOption);
      case "text":
        return this.getText(options as MinMaxOption);
      case "numeric-string":
        return this.getNumericString(options as NumericStringOption);
      case "url":
        return this.getUrl(options as UrlOption);
      case "url-domain":
        return this.getUrlDomain();
      case "array":
        assert(options != undefined, "array type options is not provided");
        return this.getArray(options as ArrayOption);
      case "number":
        return this.getNumber(options as MinMaxOption);
      case "float":
        return this.getFloat(options as MinMaxOption);
      case "username":
        return this.getPersonUsername();
      case "gender":
        return this.getPersonGender();
      case "user-bio":
        return this.getPersonBio();
      case "first-name":
        return this.getPersonFirstName(options as GenderOption);
      case "last-name":
        return this.getPersonLastName(options as GenderOption);
      case "full-name":
        return this.getPersonFullName(options as GenderOption);
      case "email":
        return this.getEmail();
      case "country":
        return this.getCountry();
      case "country-code":
        return this.getCountryCode();
      case "url-image":
        return this.getImageUrl();
      case "file":
        return this.getFile(options as FileOption);
      case "social-media-post":
        return this.getSocialMediaPost(options as SocialMediaPostOption);
      case "id":
        return this.getId();
      case "format-string":
        assert(options != undefined, "format-string type options is not provided");
        return this.getFormattedString(options as FormatStringOption);
      default:
        throw new InvalidSchemaTypeError();
    }
  }

  private getBoolean() {
    return this.fakeDataGenerator.generateBoolean();
  }

  private getEnum<T>(options: T[] | string) {
    const parsedOptions = parseReferenceValue(options, this.references);

    // defensive programming to ensure provided schema is correct
    assert(Array.isArray(parsedOptions), "enum type options must be a valid array");

    return this.fakeDataGenerator.generateEnum(parsedOptions as T[]);
  }

  private getEnumArray<T>(options: T[] | string) {
    const parsedOptions = parseReferenceValue(options, this.references);
    return this.fakeDataGenerator.generateEnumArray(parsedOptions as T[]);
  }

  private getIsoTimestamp(options: DateRangeOption) {
    const { dateFrom, dateTo } = options;
    const missingDateFrom = dateFrom == null && dateTo != null;
    const missingDateTo = dateFrom != null && dateTo == null;

    if (missingDateFrom || missingDateTo) {
      throw new InvalidDateRangeError();
    }

    const finalDateFrom = parseReferenceValue(dateFrom, this.references);
    const finalDateTo = parseReferenceValue(dateTo, this.references);

    return this.fakeDataGenerator.generateISOTimestamp(finalDateFrom, finalDateTo);
  }

  private getText(options: MinMaxOption) {
    const { min, max } = options;
    let minWordCount = MIN_COUNT;
    let maxWordCount = MAX_COUNT;

    if (min != undefined) {
      minWordCount = parseReferenceValue(min, this.references) as number;
    }

    if (max != undefined) {
      maxWordCount = parseReferenceValue(max, this.references) as number;
    }

    return this.fakeDataGenerator.generateText(minWordCount, maxWordCount);
  }

  private getUrl(options: UrlOption) {
    const { allowNumbers } = options;
    return this.fakeDataGenerator.generateURL(allowNumbers);
  }

  private getUrlDomain() {
    return this.fakeDataGenerator.generateUrlDomain();
  }

  private getNumericString(options: NumericStringOption) {
    const { min, max, allowLeadingZeros } = options;
    let minLength = MIN_COUNT;
    let maxLength = MAX_COUNT;

    if (min != undefined) {
      minLength = parseReferenceValue(min, this.references) as number;
    }

    if (max != undefined) {
      maxLength = parseReferenceValue(max, this.references) as number;
    }

    return this.fakeDataGenerator.generateNumericString(minLength, maxLength, allowLeadingZeros);
  }

  private getNumber(options: MinMaxOption) {
    const { min, max } = options;

    const minNumber = parseReferenceValue(min, this.references);
    const maxNumber = parseReferenceValue(max, this.references);

    return this.fakeDataGenerator.generateNumber(minNumber, maxNumber);
  }

  private getFloat(options: MinMaxOption) {
    const { min, max } = options;
    const minNumber = parseReferenceValue(min, this.references);
    const maxNumber = parseReferenceValue(max, this.references);

    return this.fakeDataGenerator.generateFloat(minNumber, maxNumber);
  }

  private getPersonUsername() {
    return this.fakeDataGenerator.generatePersonUsername();
  }

  private getPersonGender() {
    return this.fakeDataGenerator.generatePersonGender();
  }

  private getPersonBio() {
    return this.fakeDataGenerator.generatePersonBio();
  }

  private getPersonFirstName(options: GenderOption) {
    const { gender } = options;

    if (gender != undefined) {
      assert(
        ["male", "female"].includes(gender),
        `firstName type provided gender '${gender}' is invalid`,
      );
    }

    return this.fakeDataGenerator.generatePersonFirstName(gender);
  }

  private getPersonLastName(options: GenderOption) {
    const { gender } = options;

    if (gender != undefined) {
      assert(
        ["male", "female"].includes(gender),
        `lastName type provided gender '${gender}' is invalid`,
      );
    }
    return this.fakeDataGenerator.generatePersonLastName(gender);
  }

  private getPersonFullName(options: GenderOption) {
    const { gender } = options;

    if (gender != undefined) {
      assert(
        ["male", "female"].includes(gender),
        `fullName type provided gender '${gender}' is invalid`,
      );
    }
    return this.fakeDataGenerator.generatePersonFullName(gender);
  }

  private getEmail() {
    return this.fakeDataGenerator.generateEmail();
  }

  private getCountry() {
    return this.fakeDataGenerator.generateCountry();
  }

  private getCountryCode() {
    return this.fakeDataGenerator.generateCountryCode();
  }

  private getArray(options: ArrayOption) {
    const result: unknown[] = [];
    const { schema, min, max } = options;

    // defensive programming to ensure provided schema is correct
    assert(min != undefined, "array type, min not defined");
    assert(max != undefined, "array type, max not defined");
    assert(schema != undefined, "array type, schema not defined");

    const numberOfItems = randomIntFromInterval(min, max);

    for (let i = 0; i < numberOfItems; i++) {
      const item = this.processSchemaValue(schema);
      result.push(item);
    }

    return result;
  }

  private getObject(options: ObjectOption) {
    const result: Record<string, unknown> = {};
    const { properties } = options;

    // defensive programming to ensure provided schema is correct
    assert(properties != undefined, "object type, properties not defined");

    for (const [field, schemaValue] of Object.entries(properties)) {
      result[field] = this.processSchemaValue(schemaValue);
    }

    return result;
  }

  private getImageUrl() {
    return this.fakeDataGenerator.generateImageUrl();
  }

  private getFile(options: FileOption) {
    const { extension } = options;

    return this.fakeDataGenerator.generateFile(extension);
  }

  private getSocialMediaPost(options: SocialMediaPostOption) {
    const { languages = ["EN"], min, max, hashtagPercentage, urlPercentage } = options;

    const selectedLanguage = this.fakeDataGenerator.generateEnum(languages);

    return this.fakeDataGenerator.generateSocialMediaPost(
      selectedLanguage as Language,
      min,
      max,
      hashtagPercentage,
      urlPercentage,
    );
  }

  private getId() {
    return this.fakeDataGenerator.generateId();
  }

  private getFormattedString(options: FormatStringOption) {
    const { pattern, properties } = options;

    // defensive programming to ensure provided schema is correct
    assert(pattern != undefined, "format-string type, pattern not defined");
    assert(properties != undefined, "format-string type, properties not defined");

    let result = pattern;

    for (const property of properties) {
      const { type, options: propertyOptions } = property;

      const stringValue = this.processSchemaValue({
        type,
        options: propertyOptions,
      });
      result = result.replace("{}", String(stringValue));
    }

    return result;
  }
}
