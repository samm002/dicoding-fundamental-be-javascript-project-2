const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const {
  AuthenticationError,
  InvariantError,
  NotFoundError,
} = require('../../utils/exceptions');
const IdGenerator = require('../../utils/generateId');

class UserService {
  constructor() {
    this._pool = new Pool();
    this._idGenerator = new IdGenerator('user');
  }

  async createUser({ username, password, fullname }) {
    await this.verifyUsername(username);

    const id = this._idGenerator.generateId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed adding user');
    }

    return result.rows[0].id;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Failed getting user information, user not found',
      );
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Failed to logged in, invalid credential');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      throw new AuthenticationError('Failed to logged in, invalid credential');
    }

    return id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username from users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        'Failed adding user, username has already taken.',
      );
    }

    return result.rows[0];
  }

  async verifyUserExist(userId) {
    const query = {
      text: `SELECT id 
        FROM users
        WHERE id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0].id;
  }
}

module.exports = UserService;
