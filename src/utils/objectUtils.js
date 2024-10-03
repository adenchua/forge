export function deleteKeysFromObject(object, keysToDelete) {
  const objectCopy = JSON.parse(JSON.stringify(object));

  if (keysToDelete && keysToDelete.length > 0) {
    keysToDelete.forEach((keyToDelete) => {
      delete objectCopy[keyToDelete];
    });
  }

  return objectCopy;
}
