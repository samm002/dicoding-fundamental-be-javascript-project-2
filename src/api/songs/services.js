const pool = require('../../configs/database');
const IdGenerator = require('../../utils/generateId');
const { NotFoundError, InvariantError } = require('../../utils/exceptions');

class SongService {
  constructor() {
    this._pool = pool;
    this._idGenerator = new IdGenerator('song');
  }

  async getSongs(title, performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs',
      values: [],
    };

    if (title) {
      query.text += ' WHERE title ILIKE $1';
      query.values.push(`%${title}%`);
    }

    if (performer) {
      if (query.values.length > 0) {
        query.text += ' AND performer ILIKE $2';
      } else {
        query.text += ' WHERE performer ILIKE $1';
      }
      query.values.push(`%${performer}%`);
    }

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, performer, genre, duration FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song not found');
    }

    return result.rows[0];
  }

  async createSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = this._idGenerator.generateId();

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to create song');
    }

    return result.rows[0].id;
  }

  async editSongById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = COALESCE($2, title), year = COALESCE($3, year), performer = COALESCE($4, performer), genre = COALESCE($5, genre), duration = COALESCE($6, duration), "albumId" = COALESCE($7, "albumId") WHERE id = $1 RETURNING *',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to edit song, song not found');
    }

    return result.rows[0];
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING *',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete song, song not found');
    }

    return result.rows[0];
  }

  async verifySongExist(songId) {
    const query = {
      text: `SELECT id 
        FROM songs
        WHERE id = $1`,
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Song not found');
    }

    return result.rows[0].id;
  }
}

module.exports = SongService;
