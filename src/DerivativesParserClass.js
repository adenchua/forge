import FakeDataGenerator from "./FakeDataGeneratorClass.js";

class DerivativesParserClass {
  #fakeDataGenerator = new FakeDataGenerator();

  parseStringInterpolation(referenceObject, options) {
    const { string, referenceKeys } = options;
    let result = string;

    referenceKeys.forEach((referenceKey) => {
      const value = referenceObject[referenceKey];
      result = result.replace("{}", value);
    });

    return result;
  }

  parseCopy(referenceObject, options) {
    const { referenceKey } = options;

    return referenceObject[referenceKey];
  }

  parseRelativeDate(referenceObject, options, sequence = "before") {
    const { referenceKey, days } = options;
    const referenceDate = referenceObject[referenceKey];

    if (sequence === "after") {
      return this.#fakeDataGenerator.generateFutureISOTimestamp(days, referenceDate);
    }

    return this.#fakeDataGenerator.generatePastISOTimestamp(days, referenceDate);
  }
}

export default DerivativesParserClass;
