const playlistRoutes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getPlaylistSongsHandler(request, h),
    options: {
      auth: 'access_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.createPlaylistSongHandler(request, h),
    options: {
      auth: 'access_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.deletePlaylistSongHandler(request, h),
    options: {
      auth: 'access_jwt',
    },
  },
];

module.exports = playlistRoutes;
