export default class InvalidDerivativesTypeError extends Error {
  constructor(message: string = "invalid derivatives type") {
    super(message);
    this.name = "InvalidDerivativesTypeError";
  }
}
