const playlistRoutes = (handler) => [
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getPlaylistsHandler(request, h),
    options: {
      auth: 'access_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.createPlaylistHandler(request, h),
    options: {
      auth: 'access_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request, h) => handler.deletePlaylistByIdHandler(request, h),
    options: {
      auth: 'access_jwt',
    },
  },
];

module.exports = playlistRoutes;
