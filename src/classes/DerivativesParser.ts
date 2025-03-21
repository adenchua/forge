import assert from "node:assert";
import { flatten, unflatten } from "flat";

import InvalidDerivativesTypeError from "../errors/InvalidDerivativesTypeError";
import { Derivatives, DerivativesValue } from "../interfaces/derivatives";
import {
  CopyOptions,
  RelativeDateOptions,
  StringInterpolationOptions,
} from "../interfaces/derivativesOptions";
import FakeDataGenerator from "./FakeDataGenerator";

export default class DerivativesParser {
  private fakeDataGenerator: FakeDataGenerator;
  private flattenedReference: Record<string, unknown>;
  private flattenedOutput: Record<string, unknown>;
  private globalNullablePercentage: number = 0;
  private derivatives: Derivatives;

  constructor(
    derivatives: Derivatives,
    globalNullablePercentage: number,
    reference: Record<string, unknown>,
  ) {
    this.fakeDataGenerator = new FakeDataGenerator();
    this.globalNullablePercentage = globalNullablePercentage;
    this.derivatives = derivatives;

    // flatten it to reference it easily, set a copy as the output
    this.flattenedReference = flatten(reference, { safe: true });
    this.flattenedOutput = JSON.parse(JSON.stringify(this.flattenedReference));
  }

  parse() {
    // run through each derivative key, set to output
    for (const [delimitedFieldName, derivativesValue] of Object.entries(this.derivatives)) {
      this.flattenedOutput[delimitedFieldName] = this.processDerivatives(derivativesValue);
    }
  }

  getOutput(): object {
    return unflatten(this.flattenedOutput);
  }

  private isNull(nullablePercentage?: number): boolean {
    let finalNullablePercentage = this.globalNullablePercentage;

    if (nullablePercentage !== undefined) {
      finalNullablePercentage = nullablePercentage;
    }

    return Math.random() < finalNullablePercentage;
  }

  private processDerivatives(derivativesValue: DerivativesValue) {
    const { type, isNullable, nullablePercentage, options = {} } = derivativesValue;

    if (isNullable && this.isNull(nullablePercentage)) {
      return null;
    }

    switch (type) {
      case "string-interpolation":
        return this.parseStringInterpolation(options as StringInterpolationOptions);
      case "copy":
        return this.parseCopy(options as CopyOptions);
      case "date-before":
        return this.parseRelativeDate(options as RelativeDateOptions, "before");
      case "date-after":
        return this.parseRelativeDate(options as RelativeDateOptions, "after");
      default:
        throw new InvalidDerivativesTypeError();
    }
  }

  private parseStringInterpolation(options: StringInterpolationOptions) {
    const { pattern, referenceKeys } = options;

    // defensive programming to ensure provided schema is correct
    assert(pattern != undefined, "derivatives string-interpolation type, pattern not defined");
    assert(
      referenceKeys != undefined,
      "derivatives string-interpolation type, referenceKeys not defined",
    );

    let result = pattern;

    referenceKeys.forEach((referenceKey) => {
      const value = this.flattenedReference[referenceKey];
      result = result.replace("{}", value as string);
    });

    return result;
  }

  private parseCopy(options: CopyOptions) {
    const { referenceKey } = options;

    return this.flattenedReference[referenceKey];
  }

  private parseRelativeDate(options: RelativeDateOptions, sequence: "before" | "after") {
    const { referenceKey, days } = options;
    const referenceDate = this.flattenedReference[referenceKey];

    if (sequence === "after") {
      return this.fakeDataGenerator.generateFutureISOTimestamp(days, referenceDate as string);
    }

    return this.fakeDataGenerator.generatePastISOTimestamp(days, referenceDate as string);
  }
}
