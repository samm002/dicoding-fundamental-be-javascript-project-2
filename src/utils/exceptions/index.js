/* eslint-disable global-require */
module.exports = {
  AuthenticationError: require('./clientErrors/AuthenticationError'),
  AuthorizationError: require('./clientErrors/AuthorizationError'),
  ClientError: require('./clientErrors/ClientError'),
  InvariantError: require('./clientErrors/InvariantError'),
  NotFoundError: require('./clientErrors/NotFoundError'),
  ServerError: require('./serverErrors/ServerError'),
  InternalServerError: require('./serverErrors/InternalServerError'),
};
