const ServerError = require('./ServerError');

class InvariantError extends ServerError {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
  }
}

module.exports = InvariantError;
