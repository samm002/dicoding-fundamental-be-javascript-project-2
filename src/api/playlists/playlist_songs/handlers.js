class PlaylistSongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getPlaylistSongsHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    const playlistSongs = await this._service.getPlaylistSongs(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Getting songs in playlist success',
      data: playlistSongs,
    });

    return response;
  }

  async createPlaylistSongHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    this._validator.validatePlaylistSongPayload({
      playlist_id: playlistId,
      song_id: songId,
    });

    await this._service.createPlaylistSong(playlistId, songId, userId);

    const response = h.response({
      status: 'success',
      message: 'Adding song to playlist success',
    });

    response.code(201);

    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    this._validator.validatePlaylistSongPayload({
      playlist_id: playlistId,
      song_id: songId,
    });

    await this._service.deletePlaylistSong(playlistId, songId, userId);

    const response = h.response({
      status: 'success',
      message: 'Removing song to playlist success',
    });

    return response;
  }
}

module.exports = PlaylistSongHandler;
