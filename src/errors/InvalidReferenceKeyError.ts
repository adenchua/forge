export default class InvalidReferenceKeyError extends Error {
  constructor(message: string = "invalid reference key") {
    super(message);
    this.name = "InvalidReferenceKeyError";
  }
}
