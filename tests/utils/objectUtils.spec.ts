import { expect } from "chai";
import { describe, it } from "mocha";

import { deleteKeysFromObject } from "../../src/utils/objectUtils";

describe("Testing utility function: deleteKeysFromObject", function () {
  let counter = 0;

  it(`${++counter}. Given an object with 2 properties and 1 property to delete, it should return the correct object`, function () {
    const inputObject = { test1: 1, test2: 1 };
    const keysToDelete = ["test1"];

    const result = deleteKeysFromObject(inputObject, keysToDelete);

    expect(result).to.eql({ test2: 1 });
  });

  it(`${++counter}. Given an object with 2 properties and 2 properties to delete, it should return the correct object`, function () {
    const inputObject = { test1: 1, test2: 1 };
    const keysToDelete = ["test1", "test2"];

    const result = deleteKeysFromObject(inputObject, keysToDelete);

    expect(result).to.eql({});
  });

  it(`${++counter}. Given an object with 2 properties and 0 properties to delete, it should return the correct object`, function () {
    const inputObject = { test1: 1, test2: 1 };
    const keysToDelete = [];

    const result = deleteKeysFromObject(inputObject, keysToDelete);

    expect(result).to.eql({ test1: 1, test2: 1 });
  });

  it(`${++counter}. Given an object with 2 properties and invalid properties to delete, it should return the correct object`, function () {
    const inputObject = { test1: 1, test2: 1 };
    const keysToDelete = ["invalidKey1"];

    const result = deleteKeysFromObject(inputObject, keysToDelete);

    expect(result).to.eql({ test1: 1, test2: 1 });
  });
});
