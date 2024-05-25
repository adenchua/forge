import { faker } from "@faker-js/faker";
import { faker as fakerDE } from "@faker-js/faker/locale/de";
import { faker as fakerFR } from "@faker-js/faker/locale/fr";
import { faker as fakerKO } from "@faker-js/faker/locale/ko";
import { faker as fakerCN } from "@faker-js/faker/locale/zh_CN";
import { subYears } from "date-fns";

import { randomIntFromInterval } from "./utils/mathRandomUtils.js";

class FakeDataGenerator {
  constructor() {}

  #isValidGender(gender) {
    return ["male", "female"].includes(gender);
  }

  #isValidNonEmptyArray(array) {
    return array != null && Array.isArray(array) && array.length > 0;
  }

  generateISOTimestamp(dateFrom, dateTo) {
    if (dateFrom == null && dateTo == null) {
      return faker.date.past().toISOString();
    }

    return faker.date.between({ from: dateFrom, to: dateTo }).toISOString();
  }

  generateEnum(enumOptions) {
    if (!this.#isValidNonEmptyArray(enumOptions)) {
      throw new Error("ENUM_OPTIONS_MUST_NOT_BE_EMPTY");
    }
    return faker.helpers.arrayElement(enumOptions);
  }

  generateEnumArray(enumOptions) {
    if (!this.#isValidNonEmptyArray(enumOptions)) {
      throw new Error("ENUM_OPTIONS_MUST_NOT_BE_EMPTY");
    }

    // min 0 option needed for a chance to return no elements
    return faker.helpers.arrayElements(enumOptions, { min: 0, max: enumOptions.length });
  }

  generateBoolean() {
    return faker.datatype.boolean();
  }

  generateURL(allowNumbers = true) {
    const subDomains = [];
    // append 0~5 subdomains to the back of the URL
    const numberOfSubDomains = Math.floor(Math.random() * 6);

    for (let i = 0; i < numberOfSubDomains; i++) {
      const subDomain = faker.lorem.slug({ min: 1, max: 5 });
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
    if (gender != null && !this.#isValidGender(gender)) {
      throw new Error("INVALID_GENDER_PROVIDED");
    }
    return faker.person.firstName(gender);
  }

  generatePersonLastName(gender) {
    if (gender != null && !this.#isValidGender(gender)) {
      throw new Error("INVALID_GENDER_PROVIDED");
    }
    return faker.person.lastName(gender);
  }

  generatePersonFullName(gender) {
    if (gender != null && !this.#isValidGender(gender)) {
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

  generateSocialMediaPost(
    language,
    minWordCount = 1,
    maxWordCount = 120,
    hashtagPercentage = 0.3,
    urlPercentage = 0.05,
  ) {
    let min = Math.min(minWordCount, maxWordCount);
    let max = Math.max(minWordCount, maxWordCount);

    // only faker with correctly working locales are added to this map
    const languagesToFakerMap = {
      CN: fakerCN,
      KO: fakerKO,
      FR: fakerFR,
      DE: fakerDE,
      EN: faker,
    };

    // fall back to english should the language provided is invalid
    const fakerModule = languagesToFakerMap[language] || faker;

    let wordsArray = fakerModule.word.words({ count: { min, max } }).split(" ");

    // chance of replacing words with hashtags
    const attachHashtags = Math.random() < hashtagPercentage;

    // chance of adding a link to the end of the post
    const attachLink = Math.random() < urlPercentage;

    if (attachHashtags) {
      // minimally 1 hashtag, up to total number of words
      const hashtagCount = randomIntFromInterval(1, wordsArray.length);
      wordsArray = wordsArray.slice(hashtagCount); // remove words to make space for hashtags
      for (let i = 0; i < hashtagCount; i++) {
        wordsArray.push("#" + fakerModule.word.sample());
      }
    }

    if (attachLink) {
      wordsArray.shift(); // remove first word to make space for URL
      wordsArray.push(this.generateURL());
    }

    return wordsArray.join(" ");
  }

  generateId() {
    return faker.database.mongodbObjectId();
  }
}

export default FakeDataGenerator;
