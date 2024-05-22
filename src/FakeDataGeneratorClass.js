import { faker } from "@faker-js/faker";

class FakeDataGenerator {
  constructor() {}

  generateISOTimestamp(dateFrom, dateTo) {
    if (dateFrom == null || dateTo == null) {
      return faker.date.past();
    }

    return faker.date.between({ from: dateFrom, to: dateTo });
  }

  generateEnum(enumOptions) {
    return faker.helpers.arrayElement(enumOptions);
  }

  generateBoolean() {
    return faker.datatype.boolean();
  }

  generateURL() {
    return faker.internet.url();
  }

  generateNumericString(min, max) {
    return String(faker.number.int({ min, max }));
  }

  generateText(minWordCount = 5, maxWordCount = 120) {
    return faker.word.words({ count: { min: minWordCount, max: maxWordCount } });
  }

  generateDelimitedString(delimiter, ...enumOptionsArgs) {
    const result = [];

    for (const enumOptions of enumOptionsArgs) {
      result.push(this.generateEnum(enumOptions));
    }

    return result.join(delimiter);
  }
}

export default FakeDataGenerator;
