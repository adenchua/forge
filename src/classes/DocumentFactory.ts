import { flatten, unflatten } from "flat";

import DerivativesParser from "./DerivativesParser";
import SchemaParser from "./SchemaParser";
import { errorCodes } from "../utils/errorCodes";

export default class DocumentFactory {
  #derivativesParser = new DerivativesParser();
  #schemaParser = null;
  #resultDocument = {};
  #schema = {};
  #derivatives = {};
  #globalNullablePercentage = 0;
  #references = {};

  constructor(schema, nullablePercentage, references, derivatives) {
    this.#schema = schema || {};
    this.#globalNullablePercentage = nullablePercentage;
    this.#references = references || {};
    this.#derivatives = derivatives || {};
    this.#schemaParser = new SchemaParser(nullablePercentage);

    // builds the result document
    this.#initialize();
  }

  #initialize() {
    this.#processSchema();
    this.#processDerivatives(); // after writing values from schema, add calculated values
  }

  #processSchema() {
    for (const [fieldName, value] of Object.entries(this.#schema)) {
      const type = value.type;
      const isNullable = value.isNullable;
      const nullablePercentage = value.nullablePercentage;
      const options = value.options;

      this.#resultDocument[fieldName] = this.#schemaParser.parseSchemaType(
        type,
        isNullable,
        nullablePercentage,
        options,
        this.#references,
      );
    }
  }

  #processDerivatives() {
    if (this.#derivatives == null || Object.keys(this.#derivatives).length === 0) {
      return;
    }

    // deep clone the result document to ensure read-only
    const clonedResultDocument = JSON.parse(JSON.stringify(this.#resultDocument));
    // need safe parameter to preserve array and their contents
    const flattenedResultDocument = flatten(clonedResultDocument, { safe: true });

    for (const [delimitedFieldName, value] of Object.entries(this.#derivatives)) {
      const type = value.type;
      const isNullable = value.isNullable;
      const nullablePercentage = value.nullablePercentage;
      const options = value.options;

      flattenedResultDocument[delimitedFieldName] = this.#parseDerivatives(
        type,
        isNullable,
        nullablePercentage,
        options,
        flattenedResultDocument,
      );
    }

    // need safe parameter to preserve array and their contents
    this.#resultDocument = unflatten(flattenedResultDocument, { safe: true });
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

  #parseDerivatives(type, isNullable, nullablePercentage, options, referenceObject) {
    if (this.#isNullable(isNullable, nullablePercentage)) {
      return null;
    }

    switch (type) {
      case "string-interpolation":
        return this.#derivativesParser.parseStringInterpolation(referenceObject, options);
      case "copy":
        return this.#derivativesParser.parseCopy(referenceObject, options);
      case "date-before":
        return this.#derivativesParser.parseRelativeDate(referenceObject, options, "before");
      case "date-after":
        return this.#derivativesParser.parseRelativeDate(referenceObject, options, "after");
      default:
        throw new Error(errorCodes.invalidDerivativesType);
    }
  }

  getDocument() {
    return this.#resultDocument;
  }
}
