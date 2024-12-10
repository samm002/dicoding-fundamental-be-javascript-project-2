const Joi = require('joi');

const PlaylistSongPayloadSchema = Joi.object({
  playlist_id: Joi.string().required(),
  song_id: Joi.string().required(),
});

module.exports = PlaylistSongPayloadSchema;
