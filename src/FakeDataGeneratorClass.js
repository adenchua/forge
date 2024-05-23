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

  generateNumericString(min, max, allowLeadingZeros = false) {
    return faker.string.numeric({ length: { min, max }, allowLeadingZeros });
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

  generateNumber(min, max) {
    return faker.number.int({ min, max });
  }

  generateFloat(min, max) {
    return faker.number.float({ min, max });
  }

  generatePersonUsername() {
    return faker.internet.userName();
  }

  generatePersonGender() {
    return faker.person.sexType();
  }

  generatePersonBio() {
    return faker.person.bio();
  }

  generatePersonFirstName(gender) {
    return faker.person.firstName(gender);
  }

  generatePersonLastName(gender) {
    return faker.person.lastName(gender);
  }

  generatePersonFullName(gender) {
    return faker.person.fullName({ gender });
  }

  generateEmail() {
    return faker.internet.email();
  }

  generateCountry() {
    return faker.location.country();
  }

  generateCountryCode() {
    return faker.location.countryCode();
  }
}

export default FakeDataGenerator;
