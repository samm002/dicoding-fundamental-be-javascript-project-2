const Joi = require('joi');

const PlaylistSongActivitiesPayloadSchema = Joi.object({
  playlist_id: Joi.string().required(),
  song_id: Joi.string().required(),
  user_id: Joi.string().required(),
  action: Joi.string().required(),
});

module.exports = PlaylistSongActivitiesPayloadSchema;
