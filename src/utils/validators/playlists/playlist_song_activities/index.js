const { InvariantError } = require('../../../exceptions');
const PlaylistSongActivitiesPayloadSchema = require('./schemas');

const PlaylistValidator = {
  validatePlaylistSongActivitiesPayload: (payload) => {
    const validationResult = PlaylistSongActivitiesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
