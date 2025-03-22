export default class InvalidDateRangeError extends Error {
  constructor(message: string = "invalid date range provided") {
    super(message);
  }
}
