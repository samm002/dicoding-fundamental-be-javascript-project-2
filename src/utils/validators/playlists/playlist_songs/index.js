const { InvariantError } = require('../../../exceptions');
const PlaylistSongPayloadSchema = require('./schemas');

const PlaylistValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
