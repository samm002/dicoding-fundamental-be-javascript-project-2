const PlaylistSongHandler = require('./handlers');
const playlistSongRoutes = require('./routes');

module.exports = {
  name: 'playlist_songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistSongHandler = new PlaylistSongHandler(service, validator);
    server.route(playlistSongRoutes(playlistSongHandler));
  },
};
