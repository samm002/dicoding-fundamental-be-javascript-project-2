const { nanoid } = require('nanoid');

const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

class IdGenerator {
  constructor(type) {
    this._type = type;
  }

  generateId() {
    let randomId = nanoid(16, alphanumeric);

    randomId = randomId.replace(/[^A-Za-z0-9]/g, () => 'a');

    return `${this._type}-${randomId}`;
  }
}

module.exports = IdGenerator;
