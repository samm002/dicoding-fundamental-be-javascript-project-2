const PlaylistCollaboratorHandler = require('./handlers');
const playlistCollaboratorRoutes = require('./routes');

module.exports = {
  name: 'playlist_collaborators',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistCollaboratorHandler = new PlaylistCollaboratorHandler(
      service,
      validator,
    );
    server.route(playlistCollaboratorRoutes(playlistCollaboratorHandler));
  },
};
