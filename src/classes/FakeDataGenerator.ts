import { faker } from "@faker-js/faker";
import { faker as fakerDE } from "@faker-js/faker/locale/de";
import { faker as fakerFR } from "@faker-js/faker/locale/fr";
import { faker as fakerKO } from "@faker-js/faker/locale/ko";
import { faker as fakerCN } from "@faker-js/faker/locale/zh_CN";

import { Gender, Language } from "../interfaces/schemaOptions";
import { randomIntFromInterval } from "../utils/mathRandomUtils";

/**
 * Wrapper class of faker library to generate fake data
 */
export default class FakeDataGenerator {
  private isValidNonEmptyArray(value: unknown) {
    return value != null && Array.isArray(value) && value.length > 0;
  }

  generateISOTimestamp(dateFrom?: string, dateTo?: string) {
    if (dateFrom == null && dateTo == null) {
      return faker.date.past().toISOString();
    }

    return faker.date.between({ from: dateFrom as string, to: dateTo as string }).toISOString();
  }

  generatePastISOTimestamp(days: number, referenceISODate: string) {
    return faker.date.recent({ days, refDate: referenceISODate }).toISOString();
  }

  generateFutureISOTimestamp(days: number, referenceISODate: string) {
    return faker.date.soon({ days, refDate: referenceISODate }).toISOString();
  }

  generateEnum(enumOptions: unknown[]) {
    if (!this.isValidNonEmptyArray(enumOptions)) {
      throw new Error("ENUM_OPTIONS_MUST_NOT_BE_EMPTY");
    }
    return faker.helpers.arrayElement(enumOptions);
  }

  generateEnumArray(enumOptions: unknown[]) {
    if (!this.isValidNonEmptyArray(enumOptions)) {
      throw new Error("ENUM_OPTIONS_MUST_NOT_BE_EMPTY");
    }

    // min 0 option needed for a chance to return no elements
    return faker.helpers.arrayElements(enumOptions, { min: 0, max: enumOptions.length });
  }

  generateBoolean() {
    return faker.datatype.boolean();
  }

  generateURL(allowNumbers = false) {
    const subDomains: string[] = [];
    // append 0~5 subdomains to the back of the URL
    const numberOfSubDomains = Math.floor(Math.random() * 6);

    for (let i = 0; i < numberOfSubDomains; i++) {
      const subDomain = faker.lorem.slug({ min: 1, max: 5 });
      const randomNumber = this.generateNumber(0, 100);

      // to make URLs more realistic, numbers may be present to the sub-domain
      // 5% chance to push a number instead of the text sub-domain
      if (allowNumbers && Math.random() < 0.05) {
        subDomains.push(String(randomNumber));
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

  // set the max to signed 32-bit integer
  generateNumber(min = 0, max = 2_147_483_647) {
    return faker.number.int({ min, max });
  }

  generateFloat(min = 0.0, max = 1.0) {
    return faker.number.float({ min, max, fractionDigits: 2 });
  }

  generatePersonUsername() {
    return faker.internet.username();
  }

  generatePersonGender() {
    return faker.person.sexType();
  }

  generatePersonBio() {
    return faker.person.bio();
  }

  generatePersonFirstName(gender?: Gender) {
    return faker.person.firstName(gender);
  }

  generatePersonLastName(gender?: Gender) {
    return faker.person.lastName(gender);
  }

  generatePersonFullName(gender?: Gender) {
    return faker.person.fullName({ sex: gender });
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

  generateUrlDomain() {
    return faker.internet.domainName();
  }

  generateFile(extension?: string) {
    return faker.system.commonFileName(extension);
  }

  generateSocialMediaPost(
    language: Language,
    min = 1,
    max = 120,
    hashtagPercentage = 0.3,
    urlPercentage = 0.05,
  ) {
    let minWordCount = Math.min(min, max);
    let maxWordCount = Math.max(min, max);

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

    let wordsArray = fakerModule.word
      .words({ count: { min: minWordCount, max: maxWordCount } })
      .split(" ");

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
