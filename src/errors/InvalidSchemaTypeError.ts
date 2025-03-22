export default class InvalidSchemaTypeError extends Error {
  constructor(message: string = "invalid schema type") {
    super(message);
  }
}
