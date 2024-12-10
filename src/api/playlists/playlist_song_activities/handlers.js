class PlaylistSongActivitiesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getPlaylistSongActivitiesHandler(request, h) {
    const { userId: currentUser } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { username, action, title } = request.query;

    const playlistSongActivities = await this._service.getPlaylistSongActivities(
      playlistId,
      username,
      title,
      action,
      currentUser,
    );

    const response = h.response({
      status: 'success',
      message: 'Getting song activies in playlist success',
      data: playlistSongActivities,
    });

    return response;
  }
}

module.exports = PlaylistSongActivitiesHandler;
