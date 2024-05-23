import { expect } from "chai";
import { isBefore, isValid, isAfter } from "date-fns";
import { describe, it } from "mocha";

import FakeDataGenerator from "../src/FakeDataGeneratorClass.js";

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

describe("Testing function generateISOTimestamp from FakeDataGenerationClass", function () {
  it("1. Given a null 'dateFrom' and 'dateTo', it should return a valid ISO date", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateISOTimestamp(null, null);
    const isDateValid = isValid(new Date(response));

    expect(isDateValid).to.be.true;
  });

  it("2. Given a null 'dateFrom' and 'dateTo', it should return a random ISO date before today", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const isoDateResponse = fakeDataGenerator.generateISOTimestamp(null, null);
    const date = new Date(isoDateResponse);
    const isBeforeToday = isBefore(date, new Date());

    expect(isBeforeToday).to.be.true;
  });

  it("3. Given a valid 'dateFrom' and a null 'dateTo', it should return a random ISO date after the 'dateFrom'", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const validDateFrom = "2024-01-01";

    const isoDateResponse = fakeDataGenerator.generateISOTimestamp(validDateFrom, null);
    const isAfterDateFrom = isAfter(new Date(isoDateResponse), new Date(validDateFrom));

    expect(isAfterDateFrom).to.be.true;
  });

  it("4. Given a null 'dateFrom' and a valid 'dateTo', it should return a ISO date between 10 years to 'dateTo'", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const validDateTo = "2024-01-01";
    const date10YearsBefore = "2014-01-01";

    const isoDateResponse = fakeDataGenerator.generateISOTimestamp(null, validDateTo);
    const isBetween10Years =
      isAfter(new Date(isoDateResponse), new Date(date10YearsBefore)) &&
      isBefore(new Date(isoDateResponse), new Date(validDateTo));

    expect(isBetween10Years).to.be.true;
  });

  it("5. Given a valid 'dateFrom' and 'dateTo', it should return an ISO date between the range", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const validDateFrom = "2014-01-01";
    const validDateTo = "2024-01-01";

    const isoDateResponse = fakeDataGenerator.generateISOTimestamp(validDateFrom, validDateTo);
    const isBetweenDates =
      isBefore(new Date(isoDateResponse), new Date(validDateTo)) &&
      isAfter(new Date(isoDateResponse), new Date(validDateFrom));

    expect(isBetweenDates).to.be.true;
  });
});

describe("Testing function generateEnum from FakeDataGenerationClass", function () {
  it("1. Given an empty array, it should throw an 'ENUM_OPTIONS_MUST_NOT_BE_EMPTY' error", function () {
    const emptyArray = [];
    const fakeDataGenerator = new FakeDataGenerator();

    expect(() => fakeDataGenerator.generateEnum(emptyArray)).to.throw(
      "ENUM_OPTIONS_MUST_NOT_BE_EMPTY",
    );
  });

  it("2. Given an array of one text element, it should return the same single element", function () {
    const singleElementArray = ["test"];
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateEnum(singleElementArray);

    expect(response).to.equal("test");
  });

  it("3. Given an array of one number element, it should return the same single element", function () {
    const singleElementArray = [1];
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateEnum(singleElementArray);

    expect(response).to.equal(1);
  });

  it("4. Given an array of one boolean element, it should return the same single element", function () {
    const singleElementArray = [false];
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateEnum(singleElementArray);

    expect(response).to.equal(false);
  });

  it("5. Given an array of one object element, it should return the same single element", function () {
    const singleElementArray = [{ name: "John" }];
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateEnum(singleElementArray);

    expect(response).to.eql({ name: "John" });
  });
});

describe("Testing function generateBoolean from FakeDataGenerationClass", function () {
  it("1. It should return a boolean at random", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateBoolean();

    expect(response).to.a("boolean");
  });
});

describe("Testing function generateURL from FakeDataGenerationClass", function () {
  it("1. Given no parameters, it should generate a URL at random", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateURL();

    expect(response).to.be.a("string");
    expect(isValidUrl(response)).to.be.true;
  });
});

describe("Testing function generateNumericString from FakeDataGenerationClass", function () {
  it("1. Given no parameters, it should generate a numeric string of length 1", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateNumericString();

    expect(response).to.be.a("string");
    expect(response).to.be.lengthOf(1);
  });

  it("2. Given a min of 5 and a max of 5, it should generate a numeric string of length 5", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateNumericString(5, 5);

    expect(response).to.be.a("string");
    expect(response).to.be.lengthOf(5);
  });
});

describe("Testing function generateText from FakeDataGenerationClass", function () {
  it("1. Given no parameters, it should generate a string between 5 and 120 words", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateText();
    const numberOfWords = response.split(" ");

    expect(numberOfWords)
      .to.have.length.greaterThanOrEqual(5)
      .and.to.have.length.lessThanOrEqual(120);
  });

  it("2. Given a min parameter of 10 and a max parameter of 10, it should generate a string of 10 words", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const fixed10WordsInput = 10;

    const response = fakeDataGenerator.generateText(fixed10WordsInput, fixed10WordsInput);
    const numberOfWords = response.split(" ");

    expect(numberOfWords).to.have.lengthOf(10);
  });
});

describe("Testing function generateDelimitedString from FakeDataGenerationClass", function () {
  it("1. Given one array with one element, it should return the same element string", function () {
    const delimiter = "-";
    const enumOptions = [["hello"]];
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateDelimitedString(delimiter, enumOptions);

    expect(response).to.be.a("string");
    expect(response).to.equal("hello");
  });

  it("2. Given three arrays with one element, it should return the correct delimited string", function () {
    const delimiter = "-";
    const inputArray1 = ["hello"];
    const inputArray2 = ["world"];
    const inputArray3 = [4];
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateDelimitedString(
      delimiter,
      inputArray1,
      inputArray2,
      inputArray3,
    );

    expect(response).to.be.a("string");
    expect(response).to.equal("hello-world-4");
  });
});

describe("Testing function generateNumber from FakeDataGenerationClass", function () {
  it("1. Given no parameters, it should return a number greater or equal than 0", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateNumber();

    expect(response).to.be.a("number");
    expect(response).to.be.greaterThanOrEqual(0);
  });

  it("2. Given a min of 3 and a max of 3, it should return the number 3", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateNumber(3, 3);

    expect(response).to.be.a("number");
    expect(response).to.be.equal(3);
  });
});

describe("Testing function generateFloat from FakeDataGenerationClass", function () {
  it("1. Given no parameters, it should return a number between 0 and 1", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateFloat();

    expect(response).to.be.a("number");
    expect(response).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(1);
  });

  it("2. Given a min 3 and max 4, it should return a number between 3 and 4", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const minInput = 3;
    const maxInput = 4;

    const response = fakeDataGenerator.generateFloat(minInput, maxInput);

    expect(response).to.be.a("number");
    expect(response).to.be.greaterThanOrEqual(3).and.lessThanOrEqual(4);
  });

  it("3. Given a min 3 and max 3, it should return a number 3.0", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const sameInput = 3;

    const response = fakeDataGenerator.generateFloat(sameInput, sameInput);

    expect(response).to.be.a("number");
    expect(response).to.be.equal(3.0);
  });
});

describe("Testing function generatePersonUsername from FakeDataGenerationClass", function () {
  it("1. It should return a single string with no spaces", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generatePersonUsername();
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.lengthOf(1);
  });
});

describe("Testing function generatePersonGender from FakeDataGenerationClass", function () {
  it("1. It should return gender string of 'male' or 'female'", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generatePersonGender();

    expect(response).to.be.a("string");
    expect(["male", "female"]).includes(response);
  });
});

describe("Testing function generatePersonBio from FakeDataGenerationClass", function () {
  it("1. It should return a string", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generatePersonBio();

    expect(response).to.be.a("string");
  });
});

describe("Testing function generatePersonFirstName from FakeDataGenerationClass", function () {
  it("1. Given no parameters, It should return a string of length 1", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generatePersonFirstName();
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.lengthOf(1);
  });

  it("2. Given an invalid gender, it should throw an error 'INVALID_GENDER_PROVIDED'", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const invalidGender = "Haha";

    expect(() => fakeDataGenerator.generatePersonFirstName(invalidGender)).to.throw(
      "INVALID_GENDER_PROVIDED",
    );
  });

  it("3. Given a valid 'male' gender, It should return a string of length 1", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const validGenderInput = "male";

    const response = fakeDataGenerator.generatePersonFirstName(validGenderInput);
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.lengthOf(1);
  });

  it("4. Given a valid 'female' gender, It should return a string of length 1", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const validGenderInput = "female";

    const response = fakeDataGenerator.generatePersonFirstName(validGenderInput);
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.lengthOf(1);
  });
});

describe("Testing function generatePersonLastName from FakeDataGenerationClass", function () {
  it("1. Given no parameters, it should return a string of length 1", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generatePersonLastName();
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.lengthOf(1);
  });

  it("2. Given an invalid gender, it should throw an error 'INVALID_GENDER_PROVIDED'", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const invalidGender = "Haha";

    expect(() => fakeDataGenerator.generatePersonLastName(invalidGender)).to.throw(
      "INVALID_GENDER_PROVIDED",
    );
  });

  it("3. Given a valid 'male' gender, It should return a string of length 1", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const validGenderInput = "male";

    const response = fakeDataGenerator.generatePersonLastName(validGenderInput);
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.lengthOf(1);
  });

  it("4. Given a valid 'female' gender, It should return a string of length 1", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const validGenderInput = "female";

    const response = fakeDataGenerator.generatePersonLastName(validGenderInput);
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.lengthOf(1);
  });
});

describe("Testing function generatePersonFullName from FakeDataGenerationClass", function () {
  it("1. It should return a string of length greater or equal than 2", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generatePersonFullName();
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.length.greaterThanOrEqual(2);
  });

  it("2. Given an invalid gender, it should throw an error 'INVALID_GENDER_PROVIDED'", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const invalidGender = "Haha";

    expect(() => fakeDataGenerator.generatePersonFullName(invalidGender)).to.throw(
      "INVALID_GENDER_PROVIDED",
    );
  });

  it("3. Given a valid 'male' gender, It should return a string of length greater or equal than 2", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const validGenderInput = "male";

    const response = fakeDataGenerator.generatePersonFullName(validGenderInput);
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.length.greaterThanOrEqual(2);
  });

  it("4. Given a valid 'female' gender, It should return a string of length greater or equal than 2", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const validGenderInput = "female";

    const response = fakeDataGenerator.generatePersonFullName(validGenderInput);
    const words = response.split(" ");

    expect(response).to.be.a("string");
    expect(words).to.have.length.greaterThanOrEqual(2);
  });
});

describe("Testing function generateEmail from FakeDataGenerationClass", function () {
  it("1. It should return a valid email string", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const emailRegExp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = (email) => {
      return !!String(email).toLowerCase().match(emailRegExp);
    };

    const response = fakeDataGenerator.generateEmail();

    expect(response).to.be.a("string");
    expect(isValidEmail(response)).to.be.true;
  });
});

describe("Testing function generateCountry from FakeDataGenerationClass", function () {
  it("1. It should return a valid string", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateCountry();

    expect(response).to.be.a("string");
  });
});

describe("Testing function generateCountryCode from FakeDataGenerationClass", function () {
  it("1. It should return a valid string", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateCountryCode();

    expect(response).to.be.a("string");
  });
});

describe("Testing function generateImageUrl from FakeDataGenerationClass", function () {
  it("1. It should return a valid string", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateImageUrl();

    expect(response).to.be.a("string");
    expect(isValidUrl(response)).to.be.true;
  });
});

describe("Testing function generateFile from FakeDataGenerationClass", function () {
  it("1. It should return a valid string with a random extension", function () {
    const fakeDataGenerator = new FakeDataGenerator();

    const response = fakeDataGenerator.generateFile();
    const [, extension] = response.split(".");

    expect(response).to.be.a("string");
    expect(extension).to.not.be.null;
  });

  it("1. Given a file extension, it should return a valid string with a same extension", function () {
    const fakeDataGenerator = new FakeDataGenerator();
    const fileExtensionInput = "jpeg";

    const response = fakeDataGenerator.generateFile(fileExtensionInput);
    const [, extension] = response.split(".");

    expect(response).to.be.a("string");
    expect(extension).to.equal("jpeg");
  });
});
