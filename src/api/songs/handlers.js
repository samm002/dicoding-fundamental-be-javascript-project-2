class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;

    const songs = await this._service.getSongs(title, performer);

    const response = h.response({
      status: 'success',
      data: { songs },
    });

    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: { song },
    });

    return response;
  }

  async createSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.createSong(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        songId,
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

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSongById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Delete song success',
    });

    return response;
  }
}

module.exports = SongHandler;
