const pool = require('../../../configs/database');
const IdGenerator = require('../../../utils/generateId');
const { InvariantError, NotFoundError } = require('../../../utils/exceptions');
const mapPlaylistSongActivitiesData = require('../../../utils/mappers/playlist_song_activitiesMapper');

class PlaylistSongActivitiesService {
  constructor(playlistCollaboratorService) {
    this._pool = pool;
    this._playlistCollaboratorService = playlistCollaboratorService;
    this._idGenerator = new IdGenerator('playlist_song_activities');
  }

  async getPlaylistSongActivities(playlistId, username, title, action, currentUser) {
    await this._playlistCollaboratorService.verifyPlaylistAccess(playlistId, currentUser);

    const query = {
      text: `SELECT playlists.id AS "playlistId", 
        users.username AS username, 
        songs.title AS title, 
        playlist_song_activities.action AS action, playlist_song_activities.created_at AS time
        FROM playlist_song_activities 
        LEFT JOIN playlists ON playlists.id = playlist_song_activities.playlist_id
        LEFT JOIN songs ON songs.id = playlist_song_activities.song_id
        LEFT JOIN users ON users.id = playlist_song_activities.user_id
        WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    if (username) {
      query.text += ' AND action ILIKE $1';
      query.values.push(`%${username}%`);
    }

    if (title) {
      if (query.values.length > 0) {
        query.text += ' AND title ILIKE $2';
      } else {
        query.text += ' WHERE title ILIKE $1';
      }
      query.values.push(`%${title}%`);
    }

    if (action) {
      if (query.values.length > 0) {
        query.text += ' AND action ILIKE $2';
      } else {
        query.text += ' WHERE action ILIKE $1';
      }
      query.values.push(`%${action}%`);
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed getting playlist song activities, playlist not found');
    }

    return result.rows.length > 0
      ? mapPlaylistSongActivitiesData(result.rows)
      : result.rows;
  }

  // Record activities actions based on time
  async createPlaylistSongActivites(playlistId, songId, userId, action) {
    const id = this._idGenerator.generateId();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, userId, action],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new InvariantError('Failed creating playlist song activities');
      }

      return result.rows[0].id;
    } catch (err) {
      if (err.code === '23503') {
        throw new NotFoundError(
          'Failed creating playlist song activities, playlist / song / user not found',
        );
      }

      if (err.code === '23505') {
        throw new InvariantError(
          `Failed creating playlist song activities, song already ${
            action === 'add' ? 'added' : 'deleted'
          }`,
        );
      }

      throw err;
    }
  }
}

module.exports = PlaylistSongActivitiesService;
