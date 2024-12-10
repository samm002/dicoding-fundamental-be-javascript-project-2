const Joi = require('joi');

// Login
const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// Request Access Token using Refresh Token
const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Logout
const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
