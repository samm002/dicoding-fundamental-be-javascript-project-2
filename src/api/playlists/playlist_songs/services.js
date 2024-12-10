const pool = require('../../../configs/database');
const { InvariantError, NotFoundError } = require('../../../utils/exceptions');
const IdGenerator = require('../../../utils/generateId');
const mapPlaylistSongsData = require('../../../utils/mappers/playlist_songsMapper');

class PlaylistSongService {
  constructor(
    playlistService,
    songService,
    userService,
    playlistCollaboratorService,
    playlistSongActivitiesService,
  ) {
    this._pool = pool;
    this._playlistService = playlistService;
    this._songService = songService;
    this._userService = userService;
    this._playlistCollaboratorService = playlistCollaboratorService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._idGenerator = new IdGenerator('playlist_song');
  }

  // Get all song in the playlist
  async getPlaylistSongs(playlistId, userId) {
    await this._playlistCollaboratorService.verifyPlaylistAccess(
      playlistId,
      userId,
    );

    const query = {
      text: `SELECT playlists.id AS "playlistId", playlists.name AS "playlistName", 
        users.username AS "userUsername", 
        songs.id AS "songId", songs.title AS "songTitle", songs.performer AS "songPerformer"
        FROM playlist_songs
        LEFT JOIN playlist_collaborators ON playlist_collaborators.playlist_id = playlist_songs.playlist_id
        LEFT JOIN playlists ON playlists.id = playlist_songs.playlist_id
        LEFT JOIN users ON users.id = playlists.owner
        LEFT JOIN songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = $1 AND (playlist_collaborators.user_id = $2 OR playlists.owner = $2)`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows.length > 0
      ? mapPlaylistSongsData(result.rows)
      : result.rows;
  }

  // Add song to a playlist (creating junction table records)
  async createPlaylistSong(playlistId, songId, userId) {
    await this._playlistService.verifyPlaylistExist(playlistId);
    await this._songService.verifySongExist(songId);
    await this._userService.verifyUserExist(userId);

    await this._playlistCollaboratorService.verifyPlaylistAccess(
      playlistId,
      userId,
    );

    const id = this._idGenerator.generateId();

    const client = await this._pool.connect();

    await client.query('BEGIN');

    try {
      const query = {
        text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
        values: [id, playlistId, songId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new InvariantError('Failed adding song to playlist');
      }

      await this._playlistSongActivitiesService.createPlaylistSongActivites(
        playlistId,
        songId,
        userId,
        'add',
      );

      await client.query('COMMIT');

      return result.rows[0].id;
    } catch (err) {
      await client.query('ROLLBACK');

      if (err.code === '23505') {
        throw new InvariantError(
          'Failed adding song to playlist, song is already in the playlist',
        );
      }

      throw err;
    } finally {
      client.release();
    }
  }

  async deletePlaylistSong(playlistId, songId, userId) {
    await this._playlistCollaboratorService.verifyPlaylistAccess(
      playlistId,
      userId,
    );

    const client = await this._pool.connect();

    await client.query('BEGIN');

    try {
      const query = {
        text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
        values: [playlistId, songId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError(
          'Failed deleting song from playlist, playlist or song not found',
        );
      }

      await this._playlistSongActivitiesService.createPlaylistSongActivites(
        playlistId,
        songId,
        userId,
        'delete',
      );

      await client.query('COMMIT');

      return result.rows[0].id;
    } catch (err) {
      await client.query('ROLLBACK');

      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = PlaylistSongService;
