class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getPlaylistsHandler(request, h) {
    const { userId: owner } = request.auth.credentials;
    const { name } = request.query;

    const playlists = await this._service.getPlaylists(owner, name);

    const response = h.response({
      status: 'success',
      data: { playlists },
    });

    return response;
  }

  async createPlaylistHandler(request, h) {
    const { userId: owner } = request.auth.credentials;
    const { name } = request.payload;

    this._validator.validatePlaylistPayload({ owner, name });

    const playlistId = await this._service.createPlaylist(owner, name);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });

    response.code(201);

    return response;
  }

  async editSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;

    const song = await this._service.editSongById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Edit song success',
      data: song,
    });

    response.code(200);

    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { id } = request.params;

    await this._service.deletePlaylistById(id, userId);

    const response = h.response({
      status: 'success',
      message: 'Delete playlist success',
    });

    return response;
  }
}

module.exports = PlaylistHandler;
