const pool = require('../../configs/database');
const IdGenerator = require('../../utils/generateId');
const { InvariantError, NotFoundError, AuthorizationError } = require('../../utils/exceptions');

class PlaylistService {
  constructor() {
    this._pool = pool;
    this._idGenerator = new IdGenerator('playlist');
  }

  async getPlaylists(userId, name) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
        FROM playlists 
        LEFT JOIN playlist_collaborators ON playlist_collaborators.playlist_id = playlists.id
        LEFT JOIN users ON users.id = playlists.owner
        WHERE playlists.owner = $1 OR playlist_collaborators.user_id = $1`,
      values: [userId],
    };

    if (name) {
      query.text += ' AND name ILIKE $1';
      query.values.push(`%${name}%`);
    }

    const result = await this._pool.query(query);

    return result.rows;
  }

  async createPlaylist(owner, name) {
    const id = this._idGenerator.generateId();

    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError('Failed creating playlist');
      }

      return result.rows[0].id;
    } catch (err) {
      if (err.code === '23503') {
        throw new NotFoundError('Failed creating playlist, invalid user (user not found)');
      }

      throw err;
    }
  }

  async deletePlaylistById(id, userId) {
    await this.verifyPlaylistOwner(id, userId);
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed deleting playlist');
    }

    return result.rows[0].id;
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed verifying playlist owner, playlist not found');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== userId) {
      throw new AuthorizationError('Forbidden access you are not playlist owner');
    }

    return playlist.owner;
  }
}

module.exports = PlaylistService;
