import { flatten, unflatten } from "flat";

import DerivativesParserClass from "./DerivativesParserClass.js";
import SchemaParser from "./SchemaParserClass.js";
import { errorCodes } from "./utils/errorCodes.js";

class DocumentFactory {
  #derivativesParserClass = new DerivativesParserClass();
  #schemaParserClass = null;
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
    this.#schemaParserClass = new SchemaParser(nullablePercentage);

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

      this.#resultDocument[fieldName] = this.#schemaParserClass.parseSchemaType(
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

  getDocument() {
    return this.#resultDocument;
  }
}

export default DocumentFactory;
