class PlaylistCollaboratorHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async createPlaylistCollaboratorHandler(request, h) {
    const { userId: currentUser } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    this._validator.validatePlaylistCollaboratorPayload({
      playlist_id: playlistId,
      user_id: userId,
    });

    const collaborationId = await this._service.createPlaylistCollaborator(
      playlistId,
      userId,
      currentUser,
    );

    const response = h.response({
      status: 'success',
      message: 'Adding playlist collaborator success',
      data: {
        collaborationId,
      },
    });

    response.code(201);

    return response;
  }

  async deletePlaylistCollaboratorHandler(request, h) {
    const { userId: currentUser } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    this._validator.validatePlaylistCollaboratorPayload({
      playlist_id: playlistId,
      user_id: userId,
    });

    await this._service.deletePlaylistCollaborator(
      playlistId,
      userId,
      currentUser,
    );

    const response = h.response({
      status: 'success',
      message: 'Removing playlist collaborator success',
    });

    return response;
  }
}

module.exports = PlaylistCollaboratorHandler;
