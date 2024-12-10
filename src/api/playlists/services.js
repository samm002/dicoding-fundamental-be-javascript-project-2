const pool = require('../../configs/database');
const IdGenerator = require('../../utils/generateId');
const {
  InvariantError,
  NotFoundError,
  AuthorizationError,
} = require('../../utils/exceptions');

class PlaylistService {
  constructor(userService) {
    this._pool = pool;
    this._userService = userService;
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
    await this._userService.verifyUserExist(owner);

    const id = this._idGenerator.generateId();

    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed creating playlist');
    }

    return result.rows[0].id;
  }

  async deletePlaylistById(id, userId) {
    await this.verifyPlaylistOwner(id, userId);
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
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

    if (!result.rowCount) {
      throw new NotFoundError(
        'Failed verifying playlist owner, playlist not found',
      );
    }

    const playlist = result.rows[0];

    if (playlist.owner !== userId) {
      throw new AuthorizationError(
        'Forbidden access you are not playlist owner',
      );
    }

    return playlist.owner;
  }

  async verifyPlaylistExist(playlistId) {
    const query = {
      text: `SELECT id 
        FROM playlists
        WHERE id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found');
    }

    return result.rows[0].id;
  }
}

module.exports = PlaylistService;
