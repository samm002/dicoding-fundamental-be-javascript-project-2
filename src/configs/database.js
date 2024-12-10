const { Pool } = require('pg');

class Database {
  constructor() {
    try {
      this._pool = new Pool({
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
      });

      this._pool
        .connect()
        .then((client) => {
          console.log('Database connection success');
          client.release();
        })
        .catch((error) => {
          console.error('Database connection failed:', error.message);
          throw error;
        });
    } catch (error) {
      console.error('Failed to initialize the database pool:', error.message);
      throw error;
    }
  }

  query(...args) {
    return this._pool.query(...args);
  }

  connect() {
    return this._pool.connect();
  }
}

module.exports = new Database();
