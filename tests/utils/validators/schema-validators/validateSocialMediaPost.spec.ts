import { expect } from "chai";
import { describe, it } from "mocha";

import { validateSocialMediaPost } from "../../../../src/utils/validators/schema-validators";
import { Language } from "../../../../src/interfaces/schemaOptions";

describe("Testing utility function: validateSocialMediaPost", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateSocialMediaPost({});

    expect(response.isValid).to.be.true;
  });

  it("2. Given all valid options, it should return true", function () {
    const validLanguages: Language[] = ["EN"];
    const validMin = 1;
    const validMax = 1;
    const validHashtagPercentage = 1.0;
    const validUrlPercentage = 1.0;

    const response = validateSocialMediaPost({
      languages: validLanguages,
      min: validMin,
      max: validMax,
      hashtagPercentage: validHashtagPercentage,
      urlPercentage: validUrlPercentage,
    });

    expect(response.isValid).to.be.true;
  });

  it("3. Given an invalid empty languages, it should return false", function () {
    const emptyLanguages = [];

    const response = validateSocialMediaPost({ languages: emptyLanguages });

    expect(response.isValid).to.be.false;
  });

  it("4. Given a non-numeric min, it should return false", function () {
    const invalidMin = "1" as unknown as number;

    const response = validateSocialMediaPost({ min: invalidMin });

    expect(response.isValid).to.be.false;
  });

  it("5. Given a non-numeric max, it should return false", function () {
    const invalidMax = "1" as unknown as number;

    const response = validateSocialMediaPost({ max: invalidMax });

    expect(response.isValid).to.be.false;
  });

  it("6. Given a non-numeric hashtagPercentage, it should return false", function () {
    const invalidHashtagPercentage = "1" as unknown as number;

    const response = validateSocialMediaPost({ hashtagPercentage: invalidHashtagPercentage });

    expect(response.isValid).to.be.false;
  });

  it("7. Given a non-numeric urlPercentage, it should return false", function () {
    const invalidUrlPercentage = "1" as unknown as number;

    const response = validateSocialMediaPost({ urlPercentage: invalidUrlPercentage });

    expect(response.isValid).to.be.false;
  });

  it("8. Given a min greater than max, it should return false", function () {
    const min = 2;
    const max = 1;

    const response = validateSocialMediaPost({ min, max });

    expect(response.isValid).to.be.false;
  });
});
