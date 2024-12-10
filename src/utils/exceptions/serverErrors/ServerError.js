class ServerError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.code = code;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
