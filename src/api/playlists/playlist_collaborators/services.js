const pool = require('../../../configs/database');
const {
  InvariantError,
  AuthorizationError,
  NotFoundError,
} = require('../../../utils/exceptions');
const IdGenerator = require('../../../utils/generateId');

class PlaylistCollaboratorService {
  constructor(playlistService, userService) {
    this._pool = pool;
    this._playlistService = playlistService;
    this._userService = userService;
    this._idGenerator = new IdGenerator('playlist_collaborator');
  }

  // Add new collaborator (user) to playlist
  async createPlaylistCollaborator(playlistId, userId, currentUser) {
    await this._playlistService.verifyPlaylistExist(playlistId);
    await this._userService.verifyUserExist(userId);

    try {
      const owner = await this._playlistService.verifyPlaylistOwner(
        playlistId,
        currentUser,
      );

      if (userId === owner) {
        throw new InvariantError(
          'Failed adding playlist collaborator, cannot adding yourself (owner) as a collaborator',
        );
      }

      const id = this._idGenerator.generateId();

      const query = {
        text: 'INSERT INTO playlist_collaborators VALUES ($1, $2, $3) RETURNING id',
        values: [id, playlistId, userId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new InvariantError('Failed adding collaborator to playlist');
      }

      return result.rows[0].id;
    } catch (err) {
      if (err.code === '23505') {
        throw new InvariantError(
          'Failed adding collaborator to playlist, user already a collaborator',
        );
      }

      throw err;
    }
  }

  // Add new collaborator (user) to playlist
  async deletePlaylistCollaborator(playlistId, userId, currentUser) {
    await this._playlistService.verifyPlaylistExist(playlistId);
    await this._userService.verifyUserExist(userId);

    const owner = await this._playlistService.verifyPlaylistOwner(
      playlistId,
      currentUser,
    );

    if (userId === owner) {
      throw new InvariantError(
        'Failed deleting playlist collaborator, cannot deleting yourself (owner) from collaborator',
      );
    }

    const query = {
      text: 'DELETE FROM playlist_collaborators WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed removing collaborator from playlist');
    }

    return result.rows[0].id;
  }

  async verifyPlaylistCollaborator(playlistId, userId) {
    const query = {
      text: `SELECT * FROM playlists 
      LEFT JOIN playlist_collaborators ON playlist_collaborators.playlist_id = playlists.id  
      WHERE playlists.id = $1 AND (playlist_collaborators.user_id = $2 OR playlists.owner = $2)`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError(
        'Forbidden access, you are not a playlist owner or collaborator',
      );
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this._playlistService.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this.verifyPlaylistCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistCollaboratorService;
