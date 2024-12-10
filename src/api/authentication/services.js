const { Pool } = require('pg');

const { InvariantError } = require('../../utils/exceptions');

class AuthenticationService {
  constructor() {
    this._pool = new Pool();
  }

  /*
    To Do :
      - Hash refresh token before storing to the database
  */
  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT refresh_token FROM users WHERE refresh_token = $1',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(
        'Failed verifying refresh token, user not found',
      );
    }
  }

  // Set refresh token upon login
  async updateRefreshToken(id, refreshToken) {
    const query = {
      text: 'UPDATE users SET refresh_token = $2 WHERE id = $1',
      values: [id, refreshToken],
    };

    await this._pool.query(query);
  }

  // Delete refresh token upon logout
  async deleteRefreshToken(refreshToken) {
    const query = {
      text: 'UPDATE users SET refresh_token = NULL WHERE refresh_token = $1 RETURNING id',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed deleting refresh token, user not found');
    }
  }
}

module.exports = AuthenticationService;
