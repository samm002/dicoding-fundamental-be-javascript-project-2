const SongHandler = require('./handlers');
const songRoutes = require('./routes');

module.exports = {
  name: 'songs',
  version: '2.0.0',
  register: async (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(songRoutes(songHandler));
  },
};
