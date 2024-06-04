import { expect } from "chai";
import { describe, it } from "mocha";

import { validateArray } from "../src/utils/validators/validateArray.js";
import { validateEnum } from "../src/utils/validators/validateEnum.js";
import { validateFile } from "../src/utils/validators/validateFile.js";
import { validateFirstName } from "../src/utils/validators/validateFirstName.js";
import { validateFormatString } from "../src/utils/validators/validateFormatString.js";
import { validateIsoTimestamp } from "../src/utils/validators/validateIsoTimestamp.js";
import { validateNumber } from "../src/utils/validators/validateNumber.js";
import { validateNumericString } from "../src/utils/validators/validateNumericString.js";
import { validateObject } from "../src/utils/validators/validateObject.js";
import { validateSchemaField } from "../src/utils/validators/validateSchemaField.js";
import { validateSocialMediaPost } from "../src/utils/validators/validateSocialMediaPost.js";
import { validateText } from "../src/utils/validators/validateText.js";
import { validateUrl } from "../src/utils/validators/validateUrl.js";

describe("Testing utility function: validateSchemaField", function () {
  it("1. Given a valid schema object, it should return true", function () {
    const validSchema = { type: "enum" };
    const result = validateSchemaField("test", validSchema);

    expect(result).to.be.true;
  });

  it("2. Given an empty schema object, it should return false", function () {
    const emptySchema = {};
    const result = validateSchemaField("test", emptySchema);

    expect(result).to.be.false;
  });

  it("3. Given an invalid schema object type, it should return false", function () {
    const invalidSchemaType = { type: "invalid" };
    const result = validateSchemaField("test", invalidSchemaType);

    expect(result).to.be.false;
  });

  it("4. Given an null schema object type, it should return false", function () {
    const invalidSchema = null;
    const result = validateSchemaField("test", invalidSchema);

    expect(result).to.be.false;
  });
});

describe("Testing utility function: validateEnum", function () {
  it("1. Given a valid options, it should return true", function () {
    const validOptions = ["test"];
    const result = validateEnum("test", validOptions, {});

    expect(result).to.be.true;
  });

  it("2. Given an valid reference, it should return true", function () {
    const validReference = "#ref.array";
    const result = validateEnum("test", validReference, { array: ["test"] });

    expect(result).to.be.true;
  });

  it("3. Given an invalid empty options, it should return false", function () {
    const invalidEmptyArray = [];
    const result = validateEnum("test", invalidEmptyArray, {});

    expect(result).to.be.false;
  });

  it("4. Given an invalid reference, it should return false", function () {
    const invalidReference = "#ref.array2";
    const result = validateEnum("test", invalidReference, { array: ["test"] });

    expect(result).to.be.false;
  });
});

describe("Testing utility function: validateIsoTimestamp", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateIsoTimestamp("test", {}, {});

    expect(response).to.be.true;
  });

  it("2. Given valid dateFrom and dateTo, it should return true", function () {
    const validISODate = "2024-01-01";
    const response = validateIsoTimestamp(
      "test",
      { dateFrom: validISODate, dateTo: validISODate },
      {},
    );

    expect(response).to.be.true;
  });

  it("3. Given dateFrom and no dateTo, it should return false", function () {
    const validISODate = "2024-01-01";
    const response = validateIsoTimestamp("test", { dateFrom: validISODate }, {});

    expect(response).to.be.false;
  });

  it("4. Given dateTo and no dateFrom, it should return false", function () {
    const validISODate = "2024-01-01";
    const response = validateIsoTimestamp("test", { dateTo: validISODate }, {});

    expect(response).to.be.false;
  });

  it("5. Given valid reference key for dateTo and dateFrom, it should return true", function () {
    const referenceString = "#ref.date";
    const response = validateIsoTimestamp(
      "test",
      { dateFrom: referenceString, dateTo: referenceString },
      { date: "2024-01-01" },
    );

    expect(response).to.be.true;
  });

  it("6. Given invalid reference key for dateTo and dateFrom, it should return false", function () {
    const referenceString = "#ref.date2";
    const response = validateIsoTimestamp(
      "test",
      { dateFrom: referenceString, dateTo: referenceString },
      { date: "2024-01-01" },
    );

    expect(response).to.be.false;
  });

  it("7. Given a dateFrom later than dateTo, it should return false", function () {
    const dateTo = "2022-01-01";
    const dateFrom = "2023-01-01";
    const response = validateIsoTimestamp("test", { dateFrom, dateTo }, {});

    expect(response).to.be.false;
  });

  it("8. Given invalid dateFrom, it should return false", function () {
    const dateTo = "2022-01-01";
    const dateFrom = "2023301-01";
    const response = validateIsoTimestamp("test", { dateFrom, dateTo }, {});

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateText", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateText("test", {}, {});

    expect(response).to.be.true;
  });

  it("2. Given a valid min and max options, it should return true", function () {
    const validMin = 1;
    const validMax = 1;

    const response = validateText("test", { min: validMin, max: validMax }, {});

    expect(response).to.be.true;
  });

  it("3. Given valid reference options, it should return true", function () {
    const referenceString = "#ref.text";

    const response = validateText(
      "test",
      { min: referenceString, max: referenceString },
      { text: 1 },
    );

    expect(response).to.be.true;
  });

  it("4. Given invalid reference options, it should return false", function () {
    const referenceString = "#ref.text2";

    const response = validateText(
      "test",
      { min: referenceString, max: referenceString },
      { text: 1 },
    );

    expect(response).to.be.false;
  });

  it("5. Given a min and no max, it should return false", function () {
    const validMin = 1;

    const response = validateText("test", { min: validMin }, {});

    expect(response).to.be.false;
  });

  it("6. Given a max and no min, it should return false", function () {
    const validMax = 1;

    const response = validateText("test", { max: validMax }, {});

    expect(response).to.be.false;
  });

  it("7. Given non numeric min, it should return false", function () {
    const stringMin = "1";
    const validMax = 1;

    const response = validateText("test", { min: stringMin, max: validMax }, {});

    expect(response).to.be.false;
  });

  it("8. Given non numeric max, it should return false", function () {
    const validMin = 1;
    const stringMax = "1";

    const response = validateText("test", { min: validMin, max: stringMax }, {});

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateUrl", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateUrl("test", {});

    expect(response).to.be.true;
  });

  it("2. Given a valid allowNumbers option, it should return true", function () {
    const response = validateUrl("test", { allowNumbers: true });

    expect(response).to.be.true;
  });

  it("3. Given a string allowNumbers option, it should return false", function () {
    const response = validateUrl("test", { allowNumbers: "true" });

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateNumericString", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateNumericString("test", null, null);

    expect(response).to.be.true;
  });

  it("2. Given a valid min, max and allowLeadingZeros, it should return true", function () {
    const validMinMax = 1;
    const allowLeadingZeros = true;
    const response = validateNumericString(
      "test",
      { min: validMinMax, max: validMinMax, allowLeadingZeros },
      null,
    );

    expect(response).to.be.true;
  });

  it("3. Given a min and no max, it should return false", function () {
    const validMin = 1;
    const response = validateNumericString("test", { min: validMin }, {});

    expect(response).to.be.false;
  });

  it("4. Given a max and no min, it should return false", function () {
    const validMax = 1;
    const response = validateNumericString("test", { max: validMax }, {});

    expect(response).to.be.false;
  });

  it("5. Given valid reference key for min and max, it should return true", function () {
    const referenceString = "#ref.minMax";
    const response = validateNumericString(
      "test",
      { min: referenceString, max: referenceString },
      { minMax: 1 },
    );

    expect(response).to.be.true;
  });

  it("6. Given invalid reference key for min and max, it should return false", function () {
    const referenceString = "#ref.minMax1";
    const response = validateNumericString(
      "test",
      { min: referenceString, max: referenceString },
      { minMax: 1 },
    );

    expect(response).to.be.false;
  });

  it("7. Given a non-boolean allowLeadingZeros, it should return false", function () {
    const allowLeadingZeros = "true";
    const response = validateNumericString("test", { allowLeadingZeros });

    expect(response).to.be.false;
  });

  it("8. Given a non-numeric min, it should return false", function () {
    const stringMin = "1";
    const response = validateNumericString("test", { min: stringMin, max: 1 });

    expect(response).to.be.false;
  });

  it("9. Given a non-numeric max, it should return false", function () {
    const stringMax = "1";
    const response = validateNumericString("test", { min: 1, max: stringMax });

    expect(response).to.be.false;
  });

  it("10. Given a min greater than max, it should return false", function () {
    const min = 1;
    const max = 0;
    const response = validateNumericString("test", { min, max });

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateNumber", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateNumber("text", {}, {});

    expect(response).to.be.true;
  });

  it("2. Given valid min only, it should return true", function () {
    const response = validateNumber("text", { min: 1 }, {});

    expect(response).to.be.true;
  });

  it("3. Given valid max, it should return true", function () {
    const response = validateNumber("text", { max: 1 }, {});

    expect(response).to.be.true;
  });

  it("4. Given valid references, it should return true", function () {
    const referenceString = "#ref.minMax";
    const response = validateNumber(
      "text",
      { min: referenceString, max: referenceString },
      { minMax: 1 },
    );

    expect(response).to.be.true;
  });

  it("5. Given invalid references, it should return false", function () {
    const referenceString = "#ref.minMax1";
    const response = validateNumber(
      "text",
      { min: referenceString, max: referenceString },
      { minMax: 1 },
    );

    expect(response).to.be.false;
  });

  it("6. Given non numeric min, it should return false", function () {
    const response = validateNumber("text", { min: "1" });

    expect(response).to.be.false;
  });

  it("7. Given non numeric max, it should return false", function () {
    const response = validateNumber("text", { max: "1" });

    expect(response).to.be.false;
  });

  it("8. Given min greater than max, it should return false", function () {
    const response = validateNumber("text", { min: 2, max: 1 });

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateFirstName", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateFirstName("test", {}, {});

    expect(response).to.be.true;
  });

  it("2. Given valid gender, it should return true", function () {
    const response = validateFirstName("test", { gender: "male" }, {});

    expect(response).to.be.true;
  });

  it("3. Given an invalid gender, it should return false", function () {
    const invalidGender = "malee";
    const response = validateFirstName("test", { gender: invalidGender }, {});

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateArray", function () {
  it("1. Given a valid min, max and schema, it should return true", function () {
    const min = 0;
    const max = 0;
    const schema = { type: "iso-timestamp" };
    const response = validateArray("test", { min, max, schema }, {});

    expect(response).to.be.true;
  });

  it("2. Given no options, it should return false", function () {
    const response = validateArray("test", {}, {});

    expect(response).to.be.false;
  });

  it("3. Given non-numeric min, it should return false", function () {
    const min = "0";
    const max = 0;
    const schema = { type: "iso-timestamp" };
    const response = validateArray("test", { min, max, schema }, {});

    expect(response).to.be.false;
  });

  it("4. Given non-numeric max, it should return false", function () {
    const min = 0;
    const max = "0";
    const schema = { type: "iso-timestamp" };
    const response = validateArray("test", { min, max, schema }, {});

    expect(response).to.be.false;
  });

  it("5. Given invalid schema option, it should return false", function () {
    const min = 0;
    const max = "0";
    const schema = { type: "iso-timestampp" };
    const response = validateArray("test", { min, max, schema }, {});

    expect(response).to.be.false;
  });

  it("6. Given min is greater than max option, it should return false", function () {
    const min = 1;
    const max = 0;
    const schema = { type: "iso-timestamp" };
    const response = validateArray("test", { min, max, schema }, {});

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateFile", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateFile("test", {}, {});

    expect(response).to.be.true;
  });

  it("2. Given a valid extension, it should return true", function () {
    const response = validateFile("test", { extension: "jpg" }, {});

    expect(response).to.be.true;
  });

  it("3. Given a non-string extension, it should return false", function () {
    const response = validateFile("test", { extension: 1 }, {});

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateSocialMediaPost", function () {
  it("1. Given no options, it should return true", function () {
    const response = validateSocialMediaPost("test", {}, {});

    expect(response).to.be.true;
  });

  it("2. Given all valid options, it should return true", function () {
    const validLanguages = ["EN"];
    const validMin = 1;
    const validMax = 1;
    const validHashtagPercentage = 1.0;
    const validUrlPercentage = 1.0;

    const response = validateSocialMediaPost(
      "test",
      {
        languages: validLanguages,
        min: validMin,
        max: validMax,
        hashtagPercentage: validHashtagPercentage,
        urlPercentage: validUrlPercentage,
      },
      {},
    );

    expect(response).to.be.true;
  });

  it("3. Given an invalid empty languages, it should return false", function () {
    const emptyLanguages = [];

    const response = validateSocialMediaPost("test", { languages: emptyLanguages }, {});

    expect(response).to.be.false;
  });

  it("4. Given a non-numeric min, it should return false", function () {
    const invalidMin = "1";

    const response = validateSocialMediaPost("test", { min: invalidMin }, {});

    expect(response).to.be.false;
  });

  it("5. Given a non-numeric max, it should return false", function () {
    const invalidMax = "1";

    const response = validateSocialMediaPost("test", { max: invalidMax }, {});

    expect(response).to.be.false;
  });

  it("6. Given a non-numeric hashtagPercentage, it should return false", function () {
    const invalidHashtagPercentage = "1";

    const response = validateSocialMediaPost(
      "test",
      { hashtagPercentage: invalidHashtagPercentage },
      {},
    );

    expect(response).to.be.false;
  });

  it("7. Given a non-numeric urlPercentage, it should return false", function () {
    const invalidUrlPercentage = "1";

    const response = validateSocialMediaPost("test", { urlPercentage: invalidUrlPercentage }, {});

    expect(response).to.be.false;
  });

  it("8. Given a min greater than max, it should return false", function () {
    const min = 2;
    const max = 1;

    const response = validateSocialMediaPost("test", { min, max }, {});

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateObject", function () {
  it("1. Given valid properties option, it should return true", function () {
    const properties = [{ type: "iso-timestamp", fieldName: "testField" }];

    const response = validateObject("test", { properties }, {});

    expect(response).to.be.true;
  });

  it("2. Given no options, it should return false", function () {
    const response = validateObject("test", {}, {});

    expect(response).to.be.false;
  });

  it("3. Given empty properties option, it should return false", function () {
    const emptyProperties = [];

    const response = validateObject("test", { properties: emptyProperties }, {});

    expect(response).to.be.false;
  });

  it("4. Given properties with invalid item type, it should return false", function () {
    const properties = [{ type: "iso-timestampp", fieldName: "test" }];

    const response = validateObject("test", { properties }, {});

    expect(response).to.be.false;
  });

  it("5. Given properties with valid 'type' but without 'fieldName', it should return false", function () {
    const properties = [{ type: "iso-timestamp" }];

    const response = validateObject("test", { properties }, {});

    expect(response).to.be.false;
  });

  it("6. Given properties without 'type', it should return false", function () {
    const properties = [{ fieldName: "date" }];

    const response = validateObject("test", { properties }, {});

    expect(response).to.be.false;
  });
});

describe("Testing utility function: validateFormatString", function () {
  it("1. Given valid string & properties option, it should return true", function () {
    const response = validateFormatString(
      "test",
      {
        string: "{}.{}",
        properties: [
          {
            type: "boolean",
          },
          {
            type: "numeric-string",
          },
        ],
      },
      {},
    );

    expect(response).to.be.true;
  });

  it("2. Given no string option, it should return false", function () {
    const options = {
      properties: [
        {
          type: "boolean",
        },
        {
          type: "numeric-string",
        },
      ],
    };
    const response = validateFormatString("test", options, {});

    expect(response).to.be.false;
  });

  it("3. Given no properties option, it should return false", function () {
    const options = {
      string: "{}.{}",
    };
    const response = validateFormatString("test", options, {});

    expect(response).to.be.false;
  });

  it("4. Given non-string string option, it should return false", function () {
    const options = {
      string: 1,
      properties: [
        {
          type: "boolean",
        },
        {
          type: "numeric-string",
        },
      ],
    };
    const response = validateFormatString("test", options, {});

    expect(response).to.be.false;
  });

  it("5. Given invalid empty properties option, it should return false", function () {
    const options = {
      string: "{}",
      properties: [],
    };
    const response = validateFormatString("test", options, {});

    expect(response).to.be.false;
  });

  it("6. Given invalid property type option, it should return false", function () {
    const options = {
      string: "{}_{}",
      properties: [
        {
          type: "boolean",
        },
        {
          type: "enum-array",
          options: ["apple"],
        },
      ],
    };
    const response = validateFormatString("test", options, {});

    expect(response).to.be.false;
  });

  it("7. Given different lengths of string {} and properties length option, it should return false", function () {
    const options = {
      string: "{}_{}_{}",
      properties: [
        {
          type: "boolean",
        },
        {
          type: "numeric-string",
        },
      ],
    };
    const response = validateFormatString("test", options, {});

    expect(response).to.be.false;
  });
});
