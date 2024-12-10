const Joi = require('joi');

const PlaylistCollaboratorPayloadSchema = Joi.object({
  playlist_id: Joi.string().required(),
  user_id: Joi.string().required(),
});

module.exports = PlaylistCollaboratorPayloadSchema;
