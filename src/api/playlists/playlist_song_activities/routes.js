const playlistRoutes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getPlaylistSongActivitiesHandler(request, h),
    options: {
      auth: 'access_jwt',
    },
  },
];

module.exports = playlistRoutes;
