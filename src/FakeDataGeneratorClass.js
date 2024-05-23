import { faker } from "@faker-js/faker";
import { subYears } from "date-fns";

class FakeDataGenerator {
  constructor() {}

  #isValidGender(gender) {
    return !["male", "female"].includes(gender);
  }

  generateISOTimestamp(dateFrom, dateTo) {
    let from = dateFrom;

    if (from == null && dateTo == null) {
      return faker.date.past();
    }

    if (from == null && dateTo != null) {
      // prevent faker from throwing an error,
      // the dateFrom will give a range from before 10 years of dateTo
      from = subYears(new Date(dateTo), 10);
    }

    return faker.date.between({ from, to: dateTo });
  }

  generateEnum(enumOptions) {
    if (enumOptions == null || !Array.isArray(enumOptions) || enumOptions.length === 0) {
      throw new Error("ENUM_OPTIONS_MUST_NOT_BE_EMPTY");
    }
    return faker.helpers.arrayElement(enumOptions);
  }

  generateBoolean() {
    return faker.datatype.boolean();
  }

  generateURL(allowNumbers = true) {
    const subDomains = [];
    // append 0~5 subdomains to the back of the URL
    const numberOfSubDomains = Math.floor(Math.random() * 6);

    for (let i = 0; i < numberOfSubDomains; i++) {
      // append 1~5 dash delimited words for each sub-domain.
      const subDomain = this.generateText(1, 5).split(" ").join("-");
      const randomNumber = this.generateNumber(0, 100);

      // to make URLs more realistic, numbers may be present to the sub-domain
      // 5% chance to push a number instead of the text sub-domain
      if (allowNumbers && Math.random() < 0.05) {
        subDomains.push(randomNumber);
        continue;
      }

      subDomains.push(subDomain);
    }

    return faker.internet.url({ appendSlash: true }) + subDomains.join("/");
  }

  generateNumericString(min = 1, max = 1, allowLeadingZeros = false) {
    return faker.string.numeric({ length: { min, max }, allowLeadingZeros });
  }

  generateText(minWordCount = 5, maxWordCount = 120) {
    let min = Math.min(minWordCount, maxWordCount);
    let max = Math.max(minWordCount, maxWordCount);

    return faker.word.words({ count: { min, max } });
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
    if (gender != null && this.#isValidGender(gender)) {
      throw new Error("INVALID_GENDER_PROVIDED");
    }
    return faker.person.firstName(gender);
  }

  generatePersonLastName(gender) {
    if (gender != null && this.#isValidGender(gender)) {
      throw new Error("INVALID_GENDER_PROVIDED");
    }
    return faker.person.lastName(gender);
  }

  generatePersonFullName(gender) {
    if (gender != null && this.#isValidGender(gender)) {
      throw new Error("INVALID_GENDER_PROVIDED");
    }
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

  generateImageUrl() {
    return faker.image.url();
  }

  generateFile(extension) {
    return faker.system.commonFileName(extension);
  }
}

export default FakeDataGenerator;
