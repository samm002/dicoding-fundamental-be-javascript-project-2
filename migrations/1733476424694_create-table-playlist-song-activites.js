/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"songs"',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"users"',
      onDelete: 'cascade',
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  pgm.createIndex('playlist_song_activities', ['playlist_id', 'song_id', 'user_id']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
