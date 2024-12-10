const pool = require('../../configs/database');
const IdGenerator = require('../../utils/generateId');
const { InvariantError, NotFoundError } = require('../../utils/exceptions');

class AlbumService {
  constructor() {
    this._pool = pool;
    this._idGenerator = new IdGenerator('album');
  }

  async getAlbums(name, year) {
    const query = {
      text: 'SELECT * FROM albums',
      values: [],
    };

    if (name) {
      query.text += ' WHERE name ILIKE $1';
      query.values.push(`%${name}%`);
    }

    if (year) {
      if (query.values.length > 0) {
        query.text += ' AND year = $2';
      } else {
        query.text += ' WHERE year = $1';
      }
      query.values.push(year);
    }

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getAlbumById(id) {
    const albumQuery = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const songQuery = {
      text: 'SELECT B.id, B.title, B.year, B.performer, B.genre, B.duration FROM songs as B WHERE B."albumId" = $1',
      values: [id],
    };

    const albumResult = await this._pool.query(albumQuery);
    const songResult = await this._pool.query(songQuery);

    if (!albumResult.rows.length) {
      throw new NotFoundError(
        'Failed getting album information, album not found',
      );
    }

    albumResult.rows[0].songs = songResult.rows;

    return { album: albumResult.rows[0] };
  }

  async createAlbum({ name, year }) {
    const id = this._idGenerator.generateId();

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed creating album');
    }

    return result.rows[0].id;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = COALESCE($2, name), year = COALESCE($3, year) WHERE id = $1 RETURNING *',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed editing album, album not found');
    }

    return result.rows[0];
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING *',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed deleting album, album not found');
    }

    return result.rows[0];
  }

  async verifyAlbumExist(albumId) {
    const query = {
      text: `SELECT id 
        FROM albums
        WHERE id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album not found');
    }

    return result.rows[0].id;
  }
}

module.exports = AlbumService;
