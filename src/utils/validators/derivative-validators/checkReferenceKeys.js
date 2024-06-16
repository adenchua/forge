export function checkReferenceKeys(referencedKeys, fieldName, referencedObject = {}) {
  let flag = true;

  if (referencedKeys == null) {
    return false;
  }

  referencedKeys.forEach((referenceKey) => {
    if (!referencedObject.hasOwnProperty(referenceKey)) {
      console.error(`Invalid referenced key: ${referenceKey} for field: ${fieldName}`);
      flag = false;
    }
  });

  return flag;
}
