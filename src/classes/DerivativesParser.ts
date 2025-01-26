import FakeDataGenerator from "./FakeDataGenerator";

export default class DerivativesParser {
  #fakeDataGenerator = new FakeDataGenerator();

  parseStringInterpolation(flattenedReferenceObject, options) {
    const { string, referenceKeys } = options;
    let result = string;

    referenceKeys.forEach((referenceKey) => {
      const value = flattenedReferenceObject[referenceKey];
      result = result.replace("{}", value);
    });

    return result;
  }

  parseCopy(flattenedReferenceObject, options) {
    const { referenceKey } = options;

    return flattenedReferenceObject[referenceKey];
  }

  parseRelativeDate(flattenedReferenceObject, options, sequence = "before") {
    const { referenceKey, days } = options;
    const referenceDate = flattenedReferenceObject[referenceKey];

    if (sequence === "after") {
      return this.#fakeDataGenerator.generateFutureISOTimestamp(days, referenceDate);
    }

    return this.#fakeDataGenerator.generatePastISOTimestamp(days, referenceDate);
  }
}
