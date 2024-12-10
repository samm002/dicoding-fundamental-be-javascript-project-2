const AlbumHandler = require('./handlers');
const albumRoutes = require('./routes');

module.exports = {
  name: 'albums',
  version: '2.0.0',
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumHandler(service, validator);
    server.route(albumRoutes(albumHandler));
  },
};
