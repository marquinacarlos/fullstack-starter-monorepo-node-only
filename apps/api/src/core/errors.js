/** Expected error: one log line, no stack trace, safe to show to the client. */
export class PublicError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'PublicError';
    this.status = status;
    this.details = details;
  }
}

export class NotFoundError extends PublicError {
  constructor(message = 'Not found') {
    super(404, message);
  }
}

export class ValidationError extends PublicError {
  constructor(issues) {
    super(422, 'Validation error', issues);
  }
}
