export function validateFirstName(fieldName, options) {
  let { gender } = options || {};

  if (gender === undefined) {
    return true;
  }

  if (!["male", "female"].includes(gender)) {
    console.error(`gender supplied must be 'male' or 'female' for field: ${fieldName}`);
    return false;
  }

  return true;
}
