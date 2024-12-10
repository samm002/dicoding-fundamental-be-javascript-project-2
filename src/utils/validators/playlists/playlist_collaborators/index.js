const { InvariantError } = require('../../../exceptions');
const PlaylistCollaboratorPayloadSchema = require('./schemas');

const PlaylistValidator = {
  validatePlaylistCollaboratorPayload: (payload) => {
    const validationResult = PlaylistCollaboratorPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
