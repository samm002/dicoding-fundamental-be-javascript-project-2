const playlistCollaboratorRoutes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.createPlaylistCollaboratorHandler(request, h),
    options: {
      auth: 'access_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handler.deletePlaylistCollaboratorHandler(request, h),
    options: {
      auth: 'access_jwt',
    },
  },
];

module.exports = playlistCollaboratorRoutes;
